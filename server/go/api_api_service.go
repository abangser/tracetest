/*
 * TraceTest
 *
 * OpenAPI definition for TraceTest endpoint and resources
 *
 * API version: 0.0.1
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/kubeshop/tracetest/server/go/tracedb"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

var ErrNotFound = errors.New("record not found")

//go:generate mockgen -package=mocks -destination=mocks/testdb.go . TestDB
type TestDB interface {
	CreateTest(ctx context.Context, test *Test) (string, error)
	UpdateTest(ctx context.Context, test *Test) error
	GetTests(ctx context.Context) ([]Test, error)
	GetTest(ctx context.Context, id string) (*Test, error)

	CreateResult(ctx context.Context, testID string, res *TestRunResult) error
	UpdateResult(ctx context.Context, res *TestRunResult) error
	GetResult(ctx context.Context, id string) (*TestRunResult, error)
	GetResultsByTestID(ctx context.Context, testid string) ([]TestRunResult, error)

	CreateAssertion(ctx context.Context, testid string, assertion *Assertion) (string, error)
	GetAssertion(ctx context.Context, id string) (*Assertion, error)
	GetAssertionsByTestID(ctx context.Context, testID string) ([]Assertion, error)
}

//go:generate mockgen -package=mocks -destination=mocks/executor.go . TestExecutor
type TestExecutor interface {
	Execute(test *Test, tid trace.TraceID, sid trace.SpanID) (*TestRunResult, error)
}

// ApiApiService is a service that implements the logic for the ApiApiServicer
// This service should implement the business logic for every endpoint for the ApiApi API.
// Include any external packages or services that will be required by this service.
type ApiApiService struct {
	traceDB  tracedb.TraceDB
	testDB   TestDB
	executor TestExecutor
	rand     *rand.Rand
}

// NewApiApiService creates a default api service
func NewApiApiService(traceDB tracedb.TraceDB, testDB TestDB, executor TestExecutor) ApiApiServicer {
	return &ApiApiService{
		traceDB:  traceDB,
		testDB:   testDB,
		executor: executor,
		rand:     rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// CreateTest - Create new test
func (s *ApiApiService) CreateTest(ctx context.Context, test Test) (ImplResponse, error) {
	id, err := s.testDB.CreateTest(ctx, &test)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}

	test.TestId = id
	return Response(200, test), nil
}

// GetTest - Get a test
func (s *ApiApiService) GetTest(ctx context.Context, testid string) (ImplResponse, error) {
	test, err := s.testDB.GetTest(ctx, testid)
	if err != nil {
		switch {
		case errors.Is(ErrNotFound, err):
			return Response(http.StatusNotFound, err.Error()), err
		default:
			return Response(http.StatusInternalServerError, err.Error()), err
		}
	}

	if test.LastTestResult.TraceId != "" {
		res := test.LastTestResult
		tr, err := s.traceDB.GetTraceByID(ctx, res.TraceId)
		if err != nil {
			return Response(http.StatusInternalServerError, err.Error()), err
		}
		sid, err := trace.SpanIDFromHex(res.SpanId)
		if err != nil {
			return Response(http.StatusInternalServerError, err.Error()), err
		}
		tid, err := trace.TraceIDFromHex(res.TraceId)
		if err != nil {
			return Response(http.StatusInternalServerError, err.Error()), err
		}
		ttr := FixParent(tr, string(tid[:]), string(sid[:]))
		test.LastTestResult.Trace = mapTrace(ttr)
	}
	return Response(200, test), nil
}

// GetTests - Gets all tests
func (s *ApiApiService) GetTests(ctx context.Context) (ImplResponse, error) {
	tests, err := s.testDB.GetTests(ctx)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}

	return Response(200, tests), nil
}

func (s *ApiApiService) TestsTestIdRunPost(ctx context.Context, testid string) (ImplResponse, error) {
	t, err := s.testDB.GetTest(ctx, testid)
	//TODO switch on notFound
	if err != nil {
		return Response(http.StatusNotFound, err.Error()), err
	}

	id := uuid.New().String()
	tid := trace.TraceID{}
	s.rand.Read(tid[:])
	fmt.Printf("gen trace id: %v\n", tid)

	sid := trace.SpanID{}
	s.rand.Read(sid[:])
	fmt.Printf("gen span id: %v\n", sid)
	res := &TestRunResult{
		ResultId:  id,
		TestId:    testid,
		CreatedAt: time.Now(),
		TraceId:   tid.String(),
		SpanId:    sid.String(),
	}

	err = s.testDB.CreateResult(ctx, testid, res)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}

	go func(t Test, tid trace.TraceID, sid trace.SpanID, res TestRunResult) {
		tracer := otel.GetTracerProvider().Tracer("")
		ctx, span := tracer.Start(ctx, "Execute Test")
		defer span.End()

		fmt.Println("executing test")
		resp, err := s.executor.Execute(&t, tid, sid)
		if err != nil {
			fmt.Printf("exec err: %s", err)
			return
		}
		fmt.Println(resp)

		res.Response = resp.Response
		res.CompletedAt = time.Now()
		err = s.testDB.UpdateResult(ctx, &res)
		if err != nil {
			fmt.Printf("update result err: %s\n", err)
			return
		}

		t.LastTestResult = res
		err = s.testDB.UpdateTest(ctx, &t)
		if err != nil {
			fmt.Printf("update test last result err: %s\n", err)
			return
		}

		fmt.Println("executed successfully")
	}(*t, tid, sid, *res)

	return Response(200, TestRun{
		TestRunId: id,
	}), nil
}

// TestsIdResultsGet -
func (s *ApiApiService) TestsTestIdResultsGet(ctx context.Context, id string) (ImplResponse, error) {
	res, err := s.testDB.GetResultsByTestID(ctx, id)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}

	return Response(http.StatusOK, res), nil

}

// TestsTestidResultsIdGet -
func (s *ApiApiService) TestsTestIdResultsResultIdGet(ctx context.Context, testid string, id string) (ImplResponse, error) {
	res, err := s.testDB.GetResult(ctx, id)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}
	tr, err := s.traceDB.GetTraceByID(ctx, res.TraceId)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}
	sid, err := trace.SpanIDFromHex(res.SpanId)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}
	tid, err := trace.TraceIDFromHex(res.TraceId)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}
	ttr := FixParent(tr, string(tid[:]), string(sid[:]))
	res.Trace = mapTrace(ttr)
	return Response(http.StatusOK, *res), nil
}

func (s *ApiApiService) CreateAssertion(ctx context.Context, testID string, assertion Assertion) (ImplResponse, error) {
	id, err := s.testDB.CreateAssertion(ctx, testID, &assertion)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}

	assertion.AssertionId = id
	return Response(http.StatusOK, assertion), nil
}

func (s *ApiApiService) GetAssertions(ctx context.Context, testID string) (ImplResponse, error) {
	assertions, err := s.testDB.GetAssertionsByTestID(ctx, testID)
	if err != nil {
		return Response(http.StatusInternalServerError, err.Error()), err
	}

	return Response(http.StatusOK, assertions), nil
}
