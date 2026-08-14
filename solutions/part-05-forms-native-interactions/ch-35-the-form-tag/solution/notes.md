# Native contact form verification

| Scenario | Rendered/protocol evidence | Accessibility and state observation |
| --- | --- | --- |
| Valid submission | Native tag produces form action/method plus generated `form_type` and `utf8`; `posted_successfully?` output appears only after response. | Status text is readable without color. |
| Invalid email | Returned errors and `form.email` observed. | Summary link reaches scoped email input. |
| Missing body | Returned errors and `form.body` observed. | Body receives error relation. |
| General error | `form` key has no field link. | General message remains in alert. |
| Two instances | Each `section.id` produces unique IDs. | Labels/anchors do not cross sections. |
| Keyboard/focus | Native tab/submit path tested. | Summary precedes first control; focus enhancement verified separately. |
| JavaScript disabled | Native submission succeeds/fails normally. | Correction path remains available. |
| Generated fields | Rendered HTML inspected after theme change. | Native infrastructure untouched. |
