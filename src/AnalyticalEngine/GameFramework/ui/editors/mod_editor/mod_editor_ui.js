//Initialise functions
{
	function initialiseEditorViewMapmodes () {
		//Declare local instance variables
		var all_mapmodes = Object.keys(config.mapmodes);
		if (!main.interfaces.editor_view_mapmodes)
			main.interfaces.editor_view_mapmodes = {};
		var interface_obj = main.interfaces.editor_view_mapmodes;

		//Display Editor mapmodes
		if (!interface_obj.menu_obj) {
			var editor_view_mapmodes_menu_obj = {
				id: "editor_view_mapmodes",
				name: "AnalyticalEngine - Mapmodes:",
				no_title: false,
				persistent: ["SCENARIO_WASTELAND_CONTINENTS", "SCENARIO_WASTELAND", "SCENARIO_CIVILIZATIONS", "SCENARIO_ASSIGN", "SCENARIO_SETTINGS", "SCENARIO_RELIGION"],
				pinned: 1, //Pinned to 1 layer behind Mod Editor.

				anchor: "top_left",
				can_close: true,
				height: 400,
				width: 3*CFG.BUTTON_WIDTH,
				x: 200,
				y: 300,

				default: {
					type: "button",
					name: "Default",
					width: 3,
					x: 0,
					y: 0,

					special_function: function (e) {
						clearMap();
						clearMapmode();
					}
				}
			};
			var mapmode_button_y = 1;

			//Iterate over all_mapmodes
			for (var i = 0; i < all_mapmodes.length; i++)
				(function (local_mapmode_id) {
					var local_mapmode = config.mapmodes[all_mapmodes[i]];

					if (local_mapmode.is_editor_mapmode) {
						editor_view_mapmodes_menu_obj[all_mapmodes[i]] = {
							type: "button",
							name: (local_mapmode.name) ? local_mapmode.name : all_mapmodes[i],
							height: 0.4,
							width: 3,
							x: 0,
							y: mapmode_button_y,

							special_function: function (e) {
								console.log("Switching mapmode to: " + local_mapmode_id);
								switchMapmode(local_mapmode_id);
							}
						};

						mapmode_button_y++;
					}
				})(all_mapmodes[i]);

			//Create context menu
			var editor_view_mapmodes_menu = createContextMenu(editor_view_mapmodes_menu_obj);
		}
	}

	/**
	 * initialiseModEditor() - Initialises the main Mod Editor, mainly with UI/Window management.
	 */
	function initialiseModEditor () {
		//Declare local instance variables
		if (!main.interfaces.mod_editor)
			main.interfaces.mod_editor = {};
		var interface_obj = main.interfaces.mod_editor;
		interface_obj.active_windows = [];

		if (!interface_obj.menu_obj)
			var mod_editor_menu = createContextMenu({
				id: "mod_editor",
				draggable: false,
				name: "AnalyticalEngine - Mod Editor:",
				no_title: false,
				persistent: ["SCENARIO_WASTELAND_CONTINENTS", "SCENARIO_WASTELAND", "SCENARIO_CIVILIZATIONS", "SCENARIO_ASSIGN", "SCENARIO_SETTINGS"],
				pinned: true,
				resizeable: false,

				anchor: "top_left",
				can_close: false,
				height: 500,
				width: 3*CFG.BUTTON_WIDTH,
				x: 0,
				y: 0,

				view_wasteland_continents_button: {
					type: "button",
					name: "Edit Wasteland Continents",
					align: "left",
					width: 3,
					x: 0,
					y: 0,

					special_function: function (e) {
						switchPage("SCENARIO_WASTELAND_CONTINENTS");
					}
				},
				view_wasteland_button: {
					type: "button",
					name: "Edit Wasteland",
					align: "left",
					width: 3,
					x: 0,
					y: 1,

					special_function: function (e) {
						switchPage("SCENARIO_WASTELAND");
					}
				},
				view_scenario_civilisations: {
					type: "button",
					name: "Add/Remove Civillisations",
					align: "left",
					width: 3,
					x: 0,
					y: 2,

					special_function: function (e) {
						switchPage("SCENARIO_CIVILIZATIONS");
					}
				},
				view_scenario_assign: {
					type: "button",
					name: "Edit Scenario Map",
					align: "left",
					width: 3,
					x: 0,
					y: 3,

					special_function: function (e) {
						switchPage("SCENARIO_ASSIGN");
					}
				},
				view_scenario_settings: {
					type: "button",
					name: "Edit Scenario Config",
					align: "left",
					width: 3,
					x: 0,
					y: 4,

					special_function: function (e) {
						switchPage("SCENARIO_SETTINGS");
					}
				},
				view_mapmodes_button: {
					type: "button",
					name: "View Mapmodes",
					width: 3,
					x: 0,
					y: 5,

					special_function: function (e) {
						//Convert from parameters
						var button_el = e.element;
						var interface_obj = e.interface_obj;

						openEditorWindow("editor_view_mapmodes", initialiseEditorViewMapmodes);
					}
				},
				view_mod_editor_settings: {
					type: "button",
					name: "View Mod Editor Settings",
					width: 3,
					x: 0,
					y: 6,

					special_function: function (e) {
						//Convert from parameters
						var button_el = e.element;
						var interface_obj = e.interface_obj;

						if (!interface_obj.active_windows.includes("editor_settings"))
							interface_obj.active_windows.push("editor_settings");
					}
				}
			});


		if (!interface_obj.logic_loop)
			interface_obj.logic_loop = updateModEditor();

		//Return statement
		return main.interfaces.mod_editor;
	}

	function isInModEditor () {
		//Declare local instance variables
		var current_page = getCurrentPage();

		//Return statement
		return ["SCENARIO_WASTELAND_CONTINENTS", "SCENARIO_WASTELAND", "SCENARIO_CIVILIZATIONS", "SCENARIO_ASSIGN", "SCENARIO_SETTINGS"].includes(current_page);
	}

	function openEditorWindow (arg0_window_id, arg1_window_function) {
		//Convert from parameters
		var window_id = arg0_window_id;
		var window_function = arg1_window_function;

		//Declare local instance variables
		var interface_obj = main.interfaces.mod_editor;

		if (interface_obj)
			if (!interface_obj.active_windows.includes(window_id)) {
				//Call window_function();
				if (typeof window_function == "function") {
					window_function();
				} else if (typeof window_function == "string") {
					this[window_function]();
				}
				interface_obj.active_windows.push(window_id);
			} else {
				if (main.interfaces[window_id]) try {
					main.interfaces[window_id].menu_obj.setVisible(true);
				} catch (e) { console.error(e); }
			}
	}

	/**
	 * updateModEditor() - Updates Mod Editor UI logic.
	 */
	function updateModEditor () {
		//Return statement
		return setInterval(function(){
			//Declare local instance variables
			var current_view_id = Game.menuManager.viewID;
			var interface_obj = main.interfaces.mod_editor;

			//Toggle tab view
		}, 100);
	}
}