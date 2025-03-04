/*
 * TraceTest
 *
 * OpenAPI definition for TraceTest endpoint and resources
 *
 * API version: 0.2.1
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

type TestRunInformation struct {
	Metadata *map[string]string `json:"metadata,omitempty"`
}

// AssertTestRunInformationRequired checks if the required fields are not zero-ed
func AssertTestRunInformationRequired(obj TestRunInformation) error {
	return nil
}

// AssertRecurseTestRunInformationRequired recursively checks if required fields are not zero-ed in a nested slice.
// Accepts only nested slice of TestRunInformation (e.g. [][]TestRunInformation), otherwise ErrTypeAssertionError is thrown.
func AssertRecurseTestRunInformationRequired(objSlice interface{}) error {
	return AssertRecurseInterfaceRequired(objSlice, func(obj interface{}) error {
		aTestRunInformation, ok := obj.(TestRunInformation)
		if !ok {
			return ErrTypeAssertionError
		}
		return AssertTestRunInformationRequired(aTestRunInformation)
	})
}
