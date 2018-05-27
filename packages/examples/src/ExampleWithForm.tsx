// tslint:disable max-classes-per-file

import * as React from "react";
import { reduxForm, Field } from "redux-form/immutable";
import { withFormReducer } from "@reduxicle/redux-form";

const SampleForm = reduxForm({ form: "SampleForm" })(class extends React.PureComponent {
  public render() {
    return <div>
      <Field 
        name="myTextField"
        component="input"
      />
    </div>
  }
});

class ExampleWithForm extends React.Component {
  public render() {
    return (
      <div>
        <h1>Example using the FormManager</h1>
        <SampleForm />
      </div>
    );
  }
}

export default withFormReducer()(ExampleWithForm);
