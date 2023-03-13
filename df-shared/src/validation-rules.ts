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

export const PASSWORD_MIN_SCORE = 2;
extend("strength", {
  message: "pwd-not-complex",
  validate: (_value, args: any) => {
    if (args !== undefined) {
      return args[0] >= PASSWORD_MIN_SCORE;
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
      valid: value.match(
        // cf https://fr.wikipedia.org/wiki/Diacritiques_utilis%C3%A9s_en_fran%C3%A7ais#Patronyme
        "^[a-zA-Z \\-'’àâäçéèêëîïôöùûüÿæœÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸÆŒ]*$"
      )
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
