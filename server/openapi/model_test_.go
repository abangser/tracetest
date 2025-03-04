/*
 * TraceTest
 *
 * OpenAPI definition for TraceTest endpoint and resources
 *
 * API version: 0.2.1
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

type Test struct {
	Id string `json:"id,omitempty"`

	Name string `json:"name,omitempty"`

	Description string `json:"description,omitempty"`

	// version number of the test
	Version int32 `json:"version,omitempty"`

	ServiceUnderTest Trigger `json:"serviceUnderTest,omitempty"`

	Specs TestSpecs `json:"specs,omitempty"`
}

// AssertTestRequired checks if the required fields are not zero-ed
func AssertTestRequired(obj Test) error {
	if err := AssertTriggerRequired(obj.ServiceUnderTest); err != nil {
		return err
	}
	if err := AssertTestSpecsRequired(obj.Specs); err != nil {
		return err
	}
	return nil
}

// AssertRecurseTestRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of Test (e.g. [][]Test), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseTestRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aTest, ok := obj.(Test)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertTestRequired(aTest)
	})
}
