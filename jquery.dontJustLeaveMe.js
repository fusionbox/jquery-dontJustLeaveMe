;(function($) {

  /**
   * Django's filter_horizontals (and I assume filter_verticals) don't
   * serialize well using $.fn.serialize()
   */
  var old_val = $.fn.val;
  $.fn.val = function() {
    if ( this.is('.selector select[multiple].filtered') ) {
      return $.map(this.find('option'), function(option) {
        return option.value;
      });
    } else {
      return old_val.apply(this, arguments);
    }
  };

  /**
   * We want to ignore any inputs that:
   *
   *   1. have no name (and thus won't be submitted regardless
   *   2. are the left side of filter_horizontals (or the top of
   *      filter_verticals)
   *   3. have no value
   */
  function filterUndesirables(inputs) {
    return $.grep(inputs, function(input) {
      var $input = $(input),
          val = $input.val(),
          is_radio_or_checkbox = $input.is('[type=checkbox], [type=radio]'),
          // django admin specific
          is_left_hand_filter = $input.is('.selector select[multiple].filtered[name$="_old"]');

      return !! input.name &&
        ! is_left_hand_filter &&
        ($.isArray(val) ? val.length > 0 : !!val) &&
        (! is_radio_or_checkbox || $input.is(':checked'));
    });
  }

  /**
   * This is basically the same as $.fn.serialize, but uses
   * filterUndesirables. It should not be used for actually submitting
   * data though, for the record.
   */
  function serializeForm(form) {
    if ( window.CKEDITOR )
      // force all ckeditors to write back their values to their element
      for ( var name in CKEDITOR.instances )
        if ( CKEDITOR.instances.hasOwnProperty(name) )
          CKEDITOR.instances[name].updateElement();

    var vars = $.map(filterUndesirables(form.find(':input[name]')), function(elem) {
      return elem.name + '=' + $(elem).val();
    });

    return vars.sort().join('&');
  }

  /**
   * Don't just leave me!
   *
   * Checks if the form is the same before leaving the page as it was when we
   * came in, if not, make sure they want to leave.
   */
  $.fn.dontJustLeaveMe = function(options) {
    var options = $.extend({}, $.fn.dontJustLeaveMe.defaultOptions, options);
    return this.each(function() {
      var $form = $(this),
          was_submitted = false,
          initialState = options.serializeForm($form);

      $form.on('submit', function() {
        was_submitted = true;
      });

      $(window).on('beforeunload', function() {
        if ( ! was_submitted && options.serializeForm($form) != initialState )
          return options.errorMessage;
      });
    });
  };

  $.fn.dontJustLeaveMe.defaultOptions = {
    serializeForm: serializeForm,
    errorMessage: "You have unsaved changes, are you sure you want to leave?"
  };
})(window.jQuery || window.django.jQuery);
