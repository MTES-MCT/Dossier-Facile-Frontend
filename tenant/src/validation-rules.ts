import { extend } from "vee-validate";

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
