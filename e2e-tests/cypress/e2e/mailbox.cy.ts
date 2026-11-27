import { getEmail, WELCOME_SUBJECT } from "../support/mailbox";

describe("mailbox secret lookup", () => {
  it("reads the requested secret asynchronously and returns the matching email after polling", () => {
    const secret = "test-key&with=special-characters";
    cy.stub(cy, "env").callsFake((keys) => {
      expect(keys).to.deep.eq(["TESTMAIL_API_KEY"]);
      return cy.wrap({ TESTMAIL_API_KEY: secret }, { log: false });
    });
    const response = {
      status: 200,
      body: { result: "success", emails: [{ subject: WELCOME_SUBJECT }] },
    };
    let requests = 0;
    cy.stub(cy, "request").callsFake((options) => {
      const url = new URL(options.url, "https://mailbox.example");
      expect(url.searchParams.get("apikey")).to.eq(secret);
      expect(url.searchParams.get("tag")).to.eq("signup+test");
      expect(url.searchParams.get("namespace")).to.eq(
        Cypress.expose("TESTMAIL_NAMESPACE"),
      );
      expect(url.searchParams.get("timestamp_from")).to.eq("1234");
      expect(options.log).to.eq(false);
      requests += 1;
      return cy.wrap(
        requests === 1
          ? { status: 200, body: { result: "success", emails: [] } }
          : response,
        { log: false },
      );
    });
    getEmail(WELCOME_SUBJECT, "signup+test", 1234).then((received) => {
      expect(requests).to.eq(2);
      expect(received.body).to.deep.eq(response.body);
    });
  });
});
