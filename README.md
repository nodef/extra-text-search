<!-- Copyright (C) 2025 Subhajit Sahu -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- See LICENSE for full terms -->

This package provides simplified searching through text content of documents.

▌
📦 [JSR](https://jsr.io/@nodef/extra-text-search),
📰 [Docs](https://jsr.io/@nodef/extra-text-search/doc).

<br>
<br>


```ts
import {ReferenceIndex} from "jsr:@nodef/extra-text-search";


const index = new ReferenceIndex();

// Add some text to the index
index.add("doc1", "Humpty Dumpty sat on a wall.");
index.add("doc2", "Humpty Dumpty had a great fall!");
index.add("doc3", "Like a sunflower that follows every movement of the sun.");
index.add("doc4", "The sun is a mass of incandescent gas, a gigantic nuclear furnace.");

// Search for flowers
index.search("flowers");
// → Map(2) { "doc3" => 0.08733909728084097 }

// Search for umpty fall great
index.search("umpty fall great");
// → Map(2) { "doc1" => 0.45927932677184585, "doc2" => 1.6738179909018382 }
```

<br>
<br>


## License

This project is licensed under AGPL-3.0.

<br>
<br>


[![](https://raw.githubusercontent.com/qb40/designs/gh-pages/0/image/11.png)](https://wolfram77.github.io)<br>
[![ORG](https://img.shields.io/badge/org-nodef-green?logo=Org)](https://nodef.github.io)
![](https://ga-beacon.deno.dev/G-RC63DPBH3P:SH3Eq-NoQ9mwgYeHWxu7cw/github.com/nodef/extra-text-search)
