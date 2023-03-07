import { extend } from "vee-validate";
import { confirmed, email, required } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "field-required"
});

extend("email", {
  ...email,
  message: "email-not-valid"
});

extend("strength", {
  message: "pwd-not-complex",
  validate: (_value, args: any) => {
    const minScore = 2;
    if (args !== undefined) {
      return args[0] >= minScore;
    }
    return true;
  }
});

extend("confirmed", {
  ...confirmed,
  message: "password-not-confirmed"
});

extend("only-alpha", {
  message: "nameinformationform.only-alpha",
  validate(value) {
    return {
      required: false,
      valid: value.match("^[a-zA-Z \\-'éèëêïîöôùüàçÉÊÈËÎÏÔÇ]*$")
    };
  },
  computesRequired: true
});

extend("select", {
  message: "select-is-empty",
  validate(value) {
    return {
      required: true,
      valid: value.key
    };
  },
  computesRequired: true
});
