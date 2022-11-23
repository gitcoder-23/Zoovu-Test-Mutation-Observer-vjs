// Task 2
// Write your JavaScript here
// Hint: Think about listening to events when the assistant navigates

/**
 *
 * Main Class
 * @class
 * @param {Object} watchableNode - DOM node.
 *
 */
class zoovuApp {
  constructor(watchableNode) {
    this.watchableNode = watchableNode;
    this.observerConfig = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['data-step'],
      attributeOldValue: true,
    };
  }

  /**
   *
   * @method startWatching
   *
   */
  startWatching() {
    let _self = this;

    // Create an observer instance
    const domObserver = new MutationObserver((mutationList, observer) => {
      mutationList.forEach(function (mutation) {
        //console.log(mutation);

        // for newly added nodes, iterate over them
        for (let node of mutation.addedNodes) {
          // track only elements, skipping other nodes (e.g. text nodes)
          if (!(node instanceof HTMLElement)) continue;

          // if new nodes have navigation buttons, get step number and assign class to main container
          if (document.body.contains(node.querySelector('.page-selector'))) {
            document
              .querySelector('#zoovu-assistant')
              .classList.add(
                `step-${
                  parseInt(node.querySelector('.page-selector').dataset.step) +
                  1
                }`
              );
          }

          // if results page, add the "Visit Demo Store" Button and disconnect observer
          if (document.body.contains(node.querySelector('.top-product'))) {
            let topProductFooter = node
              .querySelector('.top-product')
              .querySelector('.product-footer');
            let visitStoreButton = document.createElement('a');

            visitStoreButton.classList.add(
              'product-button',
              'go-to-store-button'
            );
            visitStoreButton.textContent = 'Visit Demo Store';
            visitStoreButton.href = 'https://zoovudemos.com/Dyson/index.html';
            visitStoreButton.setAttribute('target', '_blank');

            topProductFooter.appendChild(visitStoreButton);

            // disconnect observer (if needed)
            domObserver.disconnect();
          }
        }

        // for future DOM changes on steps navigators, look for attribute changes, since added nodes won't work
        if (mutation.type === 'attributes') {
          // remove old step classes
          document
            .querySelector('#zoovu-assistant')
            .classList.remove(`step-${parseInt(mutation.oldValue) + 1}`);

          // add class to the zoovu assistant
          document
            .querySelector('#zoovu-assistant')
            .classList.add(
              `step-${parseInt(mutation.target.dataset.step) + 1}`
            );
        }
      });
    });

    // Start observing the target node
    domObserver.observe(this.watchableNode, this.observerConfig);
  }

  /**
   *
   * @method init
   *
   */
  init() {
    this.startWatching();
  }
}

/**
 *
 * Call the main method once DOM is loaded or can be called from immediatly invoked function
 *
 */
window.addEventListener('DOMContentLoaded', (event) => {
  // watchable DOM element
  let bodyEl = document.querySelector('body');

  // create the app instance
  let zoovuapp = new zoovuApp(bodyEl);
  zoovuapp.init();
});
