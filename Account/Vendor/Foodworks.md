---
tags:
  - vendor
colour: "#FC8220"
---
```dataviewjs
const colour = dv.current().colour;
dv.el('hr', "", {attr: {style: `border-color: ${colour};`}});
```
