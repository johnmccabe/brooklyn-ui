Brooklyn.tabs = (function() {
    /* An object to represent tab panes.
     *
     * Should be extended by objects for each kind of tab. These must override
     * the update method, which should fetch any required data and display it.
     *
     * The constructor of inheriting objects should call this.makeHandlers()
     * to create event handler functions for the object.
     *
     * Has an entity_id field. This is set to the id of the entity selected in
     * the tree, or undefined.
     */
    function Tab() {}

    Tab.prototype.makeHandlers = function() {
        /* Event Handlers.
         *
         * These are functions, not methods. They simply close over the
         * methods of Tab with the current object, so those methods can be
         * called on the required object from an event handler. This is
         * required because event handler functions are given the object on
         * which the event occured as this, not the object in which the
         * function was originally defined.
         */
        var that = this;

        this.handler = {};
        this.handler.entitySelected = function(e, entity_id) {
            console.log("entitySelected handler called with entity_id: " + entity_id);
            console.log(that);
            that.entitySelected(entity_id);
        };

        this.handler.tabSelected = function(e, tab_id) {
            that.tabSelected(tab_id);
        };

        this.handler.update = function() {
            that.update();
        };
    }

    /* Should be called when a tab is selected. Causes the selected tab to
     * start updating, by listening to the Brooklyn update message and calling
     * this.update(). If the tab is deselected, it stops listening.
     */
    Tab.prototype.tabSelected = function(tab_id) {
        console.log(tab_id + "   " + id);
        if (tab_id === this.id) {
            console.log("binding");
            update();
            $(Brooklyn.eventBus).bind("update", update);
        } else {
            console.log("unbinding");
            $(Brooklyn.eventBus).unbind("update", update);
        }
    }

    /* Implements the main logic of the tab.
     *
     * Should fetch any required data and display it.
     */
    Tab.prototype.update = function() {
        alert("Must override update method of Tab.");
    }

    /* Sets entity_id, the entity selected in the tree, and updates the tab. */
    Tab.prototype.entitySelected = function(entity_id) {
        console.log("entitySelected called with id: " + entity_id);
        this.entity_id = entity_id;
        this.update();
    }
    /* End Tab */


    function enableTabs() {
        $("#subtabs").tabs("option", "disabled", false);
    }

    function disableTabs() {
        // Should be able to use true here instead of list but it was not working.
        // Must extend the list to the number of tabs used.
        $("#subtabs").tabs("option", "disabled", [0,1,2,3,4,5,6,7,8,9,10]);
    }

    function init() {
        $("#subtabs").tabs({
            show: function(event, ui) {
                $(Brooklyn.eventBus).trigger('tab_selected', ui.panel.id);
            }
        });

        disableTabs();

        var selectEntityMessage = "<p>Select an entity.</p>";
        $('#summary-basic-info').html(selectEntityMessage);
        location.hash = "#summary";

        $(Brooklyn.eventBus).bind("entity_selected", enableTabs);
    }

    // NOTE: You can simply call getDataTable(id) once the table is initialized
    function getDataTable(id, sAjaxDataProp, aoColumns, clickCallback, data) {
        var table = $(id).dataTable( {
                "bRetrieve": true, // return existing table if initialized
                "bAutoWidth": false,
                "bLengthChange": false,
                "bJQueryUI": true,
                "bPaginate": false,
                "bDeferRender": true,
                "sAjaxDataProp": sAjaxDataProp,
                "aoColumns": aoColumns
        });

        if (clickCallback) {
            $(id + " tbody").click(clickCallback);
        }

        if (data) {
            table.fnClearTable();
            table.fnAddData(data);
        }

        return table;
    }

    function getDataTableSelectedRow(id, event) {
        var table = getDataTable(id);
        var settings = table.fnSettings().aoData;
        return settings[table.fnGetPosition(event.target.parentNode)];
    }

    function getDataTableSelectedRowData(id, event) {
        var row = getDataTableSelectedRow(id, event);
        // TODO bit hacky!
        return row._aData;
    }

    return {
        init: init,
        getDataTable: getDataTable,
        getDataTableSelectedRowData: getDataTableSelectedRowData,
        Tab: Tab
    };

}());

$(document).ready(Brooklyn.tabs.init);
