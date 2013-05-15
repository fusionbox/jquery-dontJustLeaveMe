# jquery-dontJustLeaveMe

Checks if the form is the same before leaving the page as it was when we
came in, if not, make sure they want to leave. Has special support for
django admin forms, but should work with any form.

# Usage

```javascript
$('form').dontJustLeaveMe();
```

# Options

All the options are optional.

## serializeForm

The function to use to serialize a form. Takes a form and returns a string.

## errorMessage

The message to use when there is unsaved data. The default is "You have
unsaved changes, are you sure you want to leave?"
