package model

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/kubeshop/tracetest/server/assertions/comparator"
	"github.com/kubeshop/tracetest/server/traces"
	"go.opentelemetry.io/otel/trace"
)

type (
	Test struct {
		ID               uuid.UUID
		CreatedAt        time.Time
		Name             string
		Description      string
		Version          int
		ServiceUnderTest Trigger
		ReferenceRun     *Run
		Specs            OrderedMap[SpanQuery, []Assertion]
	}

	TriggerType string

	Trigger struct {
		Type TriggerType
		HTTP *HTTPRequest
		GRPC *GRPCRequest
	}

	TriggerResult struct {
		Type TriggerType
		HTTP *HTTPResponse
		GRPC *GRPCResponse
	}

	SpanQuery string

	Assertion struct {
		Attribute  Attribute
		Comparator comparator.Comparator
		Value      string
	}

	Attribute string

	RunMetadata map[string]string

	Run struct {
		ID                        uuid.UUID
		TestID                    uuid.UUID
		TestVersion               int
		TraceID                   trace.TraceID
		SpanID                    trace.SpanID
		State                     RunState
		LastError                 error
		CreatedAt                 time.Time
		ServiceTriggeredAt        time.Time
		ServiceTriggerCompletedAt time.Time
		ObtainedTraceAt           time.Time
		CompletedAt               time.Time
		Trigger                   Trigger
		TriggerResult             TriggerResult
		Trace                     *traces.Trace
		Results                   *RunResults
		Metadata                  RunMetadata
	}

	RunResults struct {
		AllPassed bool
		Results   OrderedMap[SpanQuery, []AssertionResult]
	}

	AssertionResult struct {
		Assertion Assertion
		AllPassed bool
		Results   []SpanAssertionResult
	}

	SpanAssertionResult struct {
		SpanID        *trace.SpanID
		ObservedValue string
		CompareErr    error
	}
)

const emptyUUID = "00000000-0000-0000-0000-000000000000"

func (t Test) HasID() bool {
	return t.ID.String() != emptyUUID
}

const (
	metaPrefix    = "tracetest.selected_spans."
	metaPrefixLen = len("tracetest.selected_spans.")
)

func (a Attribute) IsMeta() bool {
	return len(a) > metaPrefixLen && a[0:metaPrefixLen] == metaPrefix
}

func (a Attribute) String() string {
	return string(a)
}

func (a Assertion) String() string {
	return fmt.Sprintf(`"%s" %s "%s"`, a.Attribute, a.Comparator, a.Value)
}

type RunState string

const (
	RunStateCreated             RunState = "CREATED"
	RunStateExecuting           RunState = "EXECUTING"
	RunStateAwaitingTrace       RunState = "AWAITING_TRACE"
	RunStateFailed              RunState = "FAILED"
	RunStateFinished            RunState = "FINISHED"
	RunStateAwaitingTestResults RunState = "AWAITING_TEST_RESULTS"
)
