import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
 stages: [
   { durations: '15s', target: 100 },
   { durations: '30s', target: 100 },
   { durations: '15s', target: 0 }
 ],
}

export default function() {
  let res = http.get("http://localhost:8080/?product_id=2");
  check(res, {
    "is status 200": (r) => r.status === 200
  });
  sleep(1);
};