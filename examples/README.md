# Examples

| Case                 | File                                    | Type                       | Contents                                                                                                                                                                            |
| -------------------- | --------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Original Export      | `Wikipedia-20210430181520.xml`          | MediaWiki export           | Revision history for Wikipedia pages "Timestamp" and "Talk:Timestamp" as of 2021-04-30 18:15:20 UTC                                                                                 |
|                      | `Wikipedia-20210430181520.xml.ots.json` | `mwts` receipts collection | Timestamp receipts for `Wikipedia-20210430181520.xml`                                                                                                                               |
| Tampered-with Export | `Wikipedia-20210430181520.tampered.xml` | MediaWiki export           | Revision history for Wikipedia pages "Timestamp" and "Talk:Timestamp" as of 2021-04-30 18:15:20 UTC; the final revision `1011086762`'s `contributor` element has been tampered with |
| Subset Export        | `Wikipedia-20210430181529.xml`          | MediaWiki export           | Revision history for Wikipedia page "Timestamp" as of 2021-04-30 18:15:29 UTC                                                                                                       |

## Demonstrations

### Verify intact Original Export

```sh-session
$ bin/run verify examples/Wikipedia-20210430181520.xml examples/Wikipedia-20210430181520.xml.ots.json
...
Timestamp      1010369467 2021-03-05T03:29:56Z sp7o2uclisg7rzclk0z6l7es8y66uxc Passed
Timestamp      1010369477 2021-03-05T03:30:00Z 0f2zwvfs05kg3gu2w3sariuvhnz5vua Passed
Timestamp      1011086762 2021-03-08T23:09:14Z 8iqb0gcfn2rmdhogu5itf8v8e9t5qcg Passed
```

**Expected result:** All 277 revisions are `Passed`.

### Verify intact Subset Export

```sh-session
$ bin/run verify examples/Wikipedia-20210430181529.xml examples/Wikipedia-20210430181520.xml.ots.json
...
Timestamp 1010369467 2021-03-05T03:29:56Z sp7o2uclisg7rzclk0z6l7es8y66uxc Passed
Timestamp 1010369477 2021-03-05T03:30:00Z 0f2zwvfs05kg3gu2w3sariuvhnz5vua Passed
Timestamp 1011086762 2021-03-08T23:09:14Z 8iqb0gcfn2rmdhogu5itf8v8e9t5qcg Passed
```

**Expected result:** All 244 revisions are `Passed`.

### Verify Tampered-with Export

```sh-session
$ bin/run verify examples/Wikipedia-20210430181520.tampered.xml examples/Wikipedia-20210430181520.xml.ots.json
...
Timestamp      1010369467 2021-03-05T03:29:56Z sp7o2uclisg7rzclk0z6l7es8y66uxc Passed
Timestamp      1010369477 2021-03-05T03:30:00Z 0f2zwvfs05kg3gu2w3sariuvhnz5vua Passed
Timestamp      1011086762 2021-03-08T23:09:14Z 8iqb0gcfn2rmdhogu5itf8v8e9t5qcg Failed
```

**Expected result:** The final revision `1011086762` is `Failed`.
