import { fail } from "assert";
import test, { describe } from "node:test";

test("Testing sesssion operations for users", async (t) => {
  let cookie = "";
  await t.test("Create session", async () => {
    try {
      const f = await fetch("http://localhost:8080/", {
        method: "GET",
        headers: {
          Accept: "text/html",
        },
      });
      const r = await f;
      if (r.headers === null) {
        fail("Failed to pass in a cookie session");
      }
      cookie = r.headers.get("set-cookie")!;
    } catch (err) {
      fail("Unable to create session");
    }
  });
});
