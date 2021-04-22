app.factory('multiTab', function ($http,$templateRequest) {
    var multiTab = {};

    /**
     * 添加新的tab
     */
    multiTab.createNewTab = function(){

    }

    function openTab(tabInstance, tab) {
        var modalOpener = $document[0].activeElement,
            modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

        toggleTopWindowClass(false);

        // Store the current top first, to determine what index we ought to use
        // for the current top modal
        previousTopOpenedModal = openedWindows.top();

        openedWindows.add(modalInstance, {
            deferred: modal.deferred,
            renderDeferred: modal.renderDeferred,
            closedDeferred: modal.closedDeferred,
            modalScope: modal.scope,
            backdrop: modal.backdrop,
            keyboard: modal.keyboard,
            openedClass: modal.openedClass,
            windowTopClass: modal.windowTopClass,
            animation: modal.animation,
            appendTo: modal.appendTo
        });

        openedClasses.put(modalBodyClass, modalInstance);

        var appendToElement = modal.appendTo,
            currBackdropIndex = backdropIndex();

        if (currBackdropIndex >= 0 && !backdropDomEl) {
            backdropScope = $rootScope.$new(true);
            backdropScope.modalOptions = modal;
            backdropScope.index = currBackdropIndex;
            backdropDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
            backdropDomEl.attr({
                'class': 'modal-backdrop',
                'ng-style': '{\'z-index\': 1040 + (index && 1 || 0) + index*10}',
                'uib-modal-animation-class': 'fade',
                'modal-in-class': 'in'
            });
            if (modal.backdropClass) {
                backdropDomEl.addClass(modal.backdropClass);
            }

            if (modal.animation) {
                backdropDomEl.attr('modal-animation', 'true');
            }
            $compile(backdropDomEl)(backdropScope);
            $animate.enter(backdropDomEl, appendToElement);
            if ($uibPosition.isScrollable(appendToElement)) {
                scrollbarPadding = $uibPosition.scrollbarPadding(appendToElement);
                if (scrollbarPadding.heightOverflow && scrollbarPadding.scrollbarWidth) {
                    appendToElement.css({ paddingRight: scrollbarPadding.right + 'px' });
                }
            }
        }

        var content;
        if (modal.component) {
            content = document.createElement(snake_case(modal.component.name));
            content = angular.element(content);
            content.attr({
                resolve: '$resolve',
                'modal-instance': '$uibModalInstance',
                close: '$close($value)',
                dismiss: '$dismiss($value)'
            });
        } else {
            content = modal.content;
        }

        // Set the top modal index based on the index of the previous top modal
        topModalIndex = previousTopOpenedModal ? parseInt(previousTopOpenedModal.value.modalDomEl.attr('index'), 10) + 1 : 0;
        var angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
        angularDomEl.attr({
            'class': 'modal',
            'template-url': modal.windowTemplateUrl,
            'window-top-class': modal.windowTopClass,
            'role': 'dialog',
            'aria-labelledby': modal.ariaLabelledBy,
            'aria-describedby': modal.ariaDescribedBy,
            'size': modal.size,
            'index': topModalIndex,
            'animate': 'animate',
            'ng-style': '{\'z-index\': 1050 + $$topModalIndex*10, display: \'block\'}',
            'tabindex': -1,
            'uib-modal-animation-class': 'fade',
            'modal-in-class': 'in'
        }).append(content);
        if (modal.windowClass) {
            angularDomEl.addClass(modal.windowClass);
        }

        if (modal.animation) {
            angularDomEl.attr('modal-animation', 'true');
        }

        appendToElement.addClass(modalBodyClass);
        if (modal.scope) {
            // we need to explicitly add the modal index to the modal scope
            // because it is needed by ngStyle to compute the zIndex property.
            modal.scope.$$topModalIndex = topModalIndex;
        }
        $animate.enter($compile(angularDomEl)(modal.scope), appendToElement);

        openedWindows.top().value.modalDomEl = angularDomEl;
        openedWindows.top().value.modalOpener = modalOpener;

        applyAriaHidden(angularDomEl);

        function applyAriaHidden(el) {
            if (!el || el[0].tagName === 'BODY') {
                return;
            }

            getSiblings(el).forEach(function(sibling) {
                var elemIsAlreadyHidden = sibling.getAttribute('aria-hidden') === 'true',
                    ariaHiddenCount = parseInt(sibling.getAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME), 10);

                if (!ariaHiddenCount) {
                    ariaHiddenCount = elemIsAlreadyHidden ? 1 : 0;
                }

                sibling.setAttribute(ARIA_HIDDEN_ATTRIBUTE_NAME, ariaHiddenCount + 1);
                sibling.setAttribute('aria-hidden', 'true');
            });

            return applyAriaHidden(el.parent());

            function getSiblings(el) {
                var children = el.parent() ? el.parent().children() : [];

                return Array.prototype.filter.call(children, function(child) {
                    return child !== el[0];
                });
            }
        }
    }

    multiTab.open = function(tabOptions){
        var tabClosedDeferred = $q.defer();

        //prepare an instance of a tab to be injected into controllers and returned to a caller
        var tabInstance = {
            closed: tabClosedDeferred.promise
        };

        //merge and clean up options
        tabOptions = angular.extend({},tabOptions);
        tabOptions.appendTo = $document.find('view_body').eq(0);

        var templateAndResolvePromise = $templateRequest(options.templateUrl)

        // Wait for the resolution of the existing promise chain.
        // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
        // Then add to $modalStack and resolve opened.
        // Finally clean up the chain variable if no subsequent modal has overwritten it.

        templateAndResolvePromise.then(function resolveSuccess(tpl) {
            var providedScope = tabOptions.scope || $rootScope;

            var modalScope = providedScope.$new();

            modalScope.$on('$destroy', function() {
              /*  if (!modalScope.$$uibDestructionScheduled) {
                    modalScope.$dismiss('$uibUnscheduledDestruction');
                }*/
            });

            var tab = {
                scope: modalScope,
                closedDeferred: tabClosedDeferred,
                animation: tabOptions.animation,
                appendTo: tabOptions.appendTo
            };

            var component = {};
            var ctrlInstance, ctrlInstantiate, ctrlLocals = {};
            tab.content = tpl[0];

            openTab(tabInstance, tab);
            /*tabClosedDeferred.resolve(true);*/
        }, function resolveError(reason) {
            tabClosedDeferred.reject(reason);
        })
        return tabInstance;
    }

    return multiTab;
});