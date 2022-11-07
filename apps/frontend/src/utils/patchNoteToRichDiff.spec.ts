import { patchAndNewTextToRichDiff } from './patchNoteToRichDiff'

describe('patchNoteToRichDiff', () => {
  it('should return a rich diff', () => {
    const patch = `@@ -8,6 +8,6 @@\n mtime: 20210701195459\n ctime: 20210302154219\n ---\n \n-# edge modes\n+# Edge Modes\n \n Edge modes are the ways systems behave at their boundaries.`

    const file = `---
title: edge modes
tags:
  - definition
  - FQHE
id: 8f85f6a3-da87-421d-9b71-7b0f2c4c9ea8
mtime: 20210701195459
ctime: 20210302154219
---

# Edge Modes

Edge modes are the ways systems behave at their boundaries.`

    expect(patchAndNewTextToRichDiff(patch, file)).toEqual(
      `---
title: edge modes
tags:
  - definition
  - FQHE
id: 8f85f6a3-da87-421d-9b71-7b0f2c4c9ea8
mtime: 20210701195459
ctime: 20210302154219
---

# <del>e</del><ins>E</ins>dge <del>m</del><ins>M</ins>odes

Edge modes are the ways systems behave at their boundaries.`,
    )
  })
})
