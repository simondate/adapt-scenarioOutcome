define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var ScenarioOutcomeView = ComponentView.extend({

    events: {
      'click .js-scenarioOutcome-btn': 'onButtonClick'
    },

    preRender: function() {
      console.log(this)
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();
      this.setupInview();
      this.listenTo(this.model, {
        "change:_isHidden": this.isRevealed
      });
    },

    isRevealed: function() {
      if(this.model.get('_isHidden')) return;
      var ancestorModels = this.model.getAncestorModels();
      var blockPos = ancestorModels[0].get('_nthChild');
      console.log(blockPos)
      var page = ancestorModels[2];
      this.hideBlocks(page, blockPos);
    },

    hideBlocks: function(page, currentBlockNthChild) {

      _.each(page.findDescendantModels('blocks'), function(block){
        block.set('_isLocked', false)
        console.log(block.get('_nthChild'))
        console.log(currentBlockNthChild)
        if(block.get('_nthChild') > currentBlockNthChild) {
          console.log(block)
          block.set('_isHidden', true);
          block.set('_isAvailable', false);
        }
      });
    },

    onButtonClick: function(event) {

      var $target = $(event.currentTarget);
      console.log($target)
      var interaction = $target.attr('data-type');
      var index = $target.attr('data-item-index');

      switch (interaction) {
        case '_restart':
          console.log('restart page');
          break;
        case '_menu':
          console.log('Go to menu');
          break;
        default:
        break;
      }
    },

    setupInview: function() {
      var selector = this.getInviewElementSelector();
      if (!selector) {
        // this.setCompletionStatus();
        return;
      }

      // this.setupInviewCompletion(selector);
    },

    /**
     * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
     */
    getInviewElementSelector: function() {
      if (this.model.get('body')) return '.component__body';

      if (this.model.get('instruction')) return '.component__instruction';

      if (this.model.get('displayTitle')) return '.component__title';

      return null;
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  },
  {
    template: 'scenarioOutcome'
  });

  return Adapt.register('scenarioOutcome', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: ScenarioOutcomeView
  });
});
