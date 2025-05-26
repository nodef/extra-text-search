// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms

import {assert}         from "jsr:@std/assert@1.0.13";
import {ReferenceIndex} from "./index.ts";




Deno.test("ReferenceIndex", () => {
  const index = new ReferenceIndex();
  index.add("doc1", "Humpty Dumpty sat on a wall.");
  index.add("doc2", "Humpty Dumpty had a great fall!");
  index.add("doc3", "Like a sunflower that follows every movement of the sun.");
  index.add("doc4", "The sun is a mass of incandescent gas, a gigantic nuclear furnace.");
  const a = index.match("flowers");
  assert(a.get("doc3")! > (a.get("doc4") || 0));
  const b = index.match("umpty fall great");
  console.log(b);
  assert(b.get("doc2")! > b.get("doc1")!);
});
