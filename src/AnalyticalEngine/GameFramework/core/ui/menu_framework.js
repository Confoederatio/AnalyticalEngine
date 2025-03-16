//Initialise functions
{
	/**
	 * addCustomUI() - Adds a context menu UI to the game.
	 * @param {Object} [arg0_options]
	 *  @param {String} [arg0_options.id] - The ID of the Custom UI to use in main.interfaces.
	 *  @param {Array<String>} [arg0_options.pages=["IN_GAME"]] - The pages on which to display the menu.
	 *
	 *  @param {Object} [arg0_options.options]
	 *   @param {String} [arg0_options.options.anchor="top_left"] - Either 'bottom_left', 'bottom_right', 'top_left', or 'top_right'.
	 *   @param {String} [arg0_options.options.id] - Random ID by default.
	 *
	 *   @param {boolean} [arg0_options.options.can_close=true]
	 *   @param {boolean} [arg0_options.options.do_not_display=false] - Whether to display the menu or simply return its form without .menu_obj;
	 *   @param {boolean} [arg0_options.options.draggable=true]
	 *   @param {boolean} [arg0_options.options.has_back_button=false]
	 *   @param {boolean} [arg0_options.options.lock_hover=false]
	 *   @param {String} [arg0_options.options.name] - If undefined, the MenuTitle is null instead.
	 *   @param {boolean} [arg0_options.options.no_title=true] - Whether there is a title or not.
	 *   @param {boolean} [arg0_options.options.pinned=false] - If the Menu is pinned such that it always sits at the front.
	 *   @param {Array<String>|boolean|String} [arg0_options.options.persistent=false] - If the menu should persist across view changes. False by default.
	 *   @param {boolean} [arg0_options.options.raw_coords=false] - Whether to skip auto-formatting and manually supply all coords. For use in non-vertical menus.
	 *   @param {boolean} [arg0_options.options.resizeable=true]
	 *
	 *   @param {number} [arg0_options.options.height]
	 *   @param {number} [arg0_options.options.width=2] - The width as multiplied by CFG.BUTTON_WIDTH.
	 *   @param {number} [arg0_options.options.x]
	 *   @param {number} [arg0_options.options.y]
	 *
	 *   @param {Object} [arg0_options.options."input_key"]
	 *    @param {String} [arg0_options.options."input_key".name]
	 * 	  @param {String} [arg0_options.options."input_key".type] - Either 'bar_chart'/'button'/'flag_button'/'large_flag_button'/'line_graph'/'minimap'/'pie_chart'/'pie_chart_with_stats'/'scroll_text'/'slider'/'text'.
	 * 	  @param {number} [arg0_options.options."input_key".raw_coords=false] - Whether to use raw specified coords instead of autoformatting.
	 * 	  @param {number} [arg0_options.options."input_key".raw_dimensions=false] - Whether to override default multiplication for .width.
	 * 	  @param {number} [arg0_options.options."input_key".height=2] - The height as multiplied by CFG.BUTTON_WIDTH.
	 * 	  @param {number} [arg0_options.options."input_key".width=2] - The width as multiplied by CFG.BUTTON_WIDTH.
	 * 	  @param {number} [arg0_options.options."input_key".x]
	 * 	  @param {number} [arg0_options.options."input_key".y]
	 *
	 *    @param {String} [arg0_options.options."input_key".align="centre"] - Optional. Either 'left', 'centre', or 'right'.
	 *    @param {boolean} [arg0_options.options.clickable=true]
	 *    @param {Function} [arg0_options.options."input_key".special_function]
	 *    @param {String} [arg0_options.options."input_key".tooltip]
	 * @param {Function} [arg0_options.init_function] - Feeds (arg0_interface_obj) as parameters.
	 * @param {Function} [arg0_options.update_function] - Feeds (arg0_interface_obj) as parameters.
	 * @param {number} [arg0_options.update_interval=100] - How often to run the update function.
	 *
	 *  @returns {{id: String, menu_elements: Array<MenuElement>, menu_flags: {}, menu_properties: {}, menu_obj: Menu}}
	 */
	function addCustomUI (arg0_options) {
		//Convert from parameters.
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		options.id = (options.id) ? options.idd : generateRandomID(main.interfaces);
		options.pages = (options.pages) ? getList(options.pages) : ["IN_GAME"];

		//Declare local instance variables
		var random_page_change_id = generateRandomID(global.on_page_change);

		//Set page change event
		global.on_page_change[random_page_change_id] = function (arg0_current_page) {
			//Convert from parameters
			var current_page = arg0_current_page;

			//Initialise interface_obj if it doesn't already exist
			if (options.pages.includes(current_page))
				if (!main.interfaces[options.id]) {
					//Set initial interface settings
					if (!main.interfaces[options.id])
						main.interfaces[options.id] = {};
					var interface_obj = main.interfaces[options.id];

					if (options.pre_init_function)
						options.pre_init_function(interface_obj);

					var local_context_menu = createContextMenu(options.options);

					if (!interface_obj.logic_loop)
						interface_obj.logic_loop = setInterval(function(){
							try {
								interface_obj.update_function(interface_obj);
							} catch (e) {
								console.error(e.stack);
							}
						}, (interface_obj.update_interval) ? interface_obj.update_interval : 100);
					interface_obj.init_function(interface_obj);
				}
		};

		//Return statement
		return interface_obj;
	}

	/**
	 * addElements() - Add context menu elements to another context menu.
	 * @param {String} arg0_interface_id - The interface ID to add menu elements to.
	 * @param {Object<ContextMenu>} arg1_context_menu_obj - The ContextMenu Object to create elements for. Make sure to set do_not_display to true when creating ContextMenu Object.
	 * @returns {{id: String, menu_elements: Array<MenuElement>, menu_flags: {}, menu_properties: {}, menu_obj: Menu}}
	 */
	function addElements (arg0_interface_id, arg1_context_menu_obj) { //[WIP] - Finish function body
		//Convert from parameters
		var interface_id = arg0_interface_id;
		var context_menu_obj = arg1_context_menu_obj;

		//Declare local instance variables
		var interface_obj = main.interfaces[interface_id];
		var menu_elements_size = context_menu_obj.menu_obj.getMenuElementsSize();

		//Iterate over context_menu_obj.menu_elements
		for (var i = 0; i < context_menu_obj.menu_elements.length; i++) {
			//Push to current interface_obj
			interface_obj.menu_elements.push(context_menu_obj.menu_elements[i]);
			if (context_menu_obj.menu_flags[i])
				interface_obj.menu_flags.push(context_menu_obj.menu_flags[i]);
			interface_obj.menu_properties.push(context_menu_obj.menu_properties[i]);

			//Add to actual interface_obj.menu_obj to be displayed
			interface_obj.menu_obj.setMenuElement(menu_elements_size + i, context_menu_obj.menu_elements[i]);
		}

		//Update interface_obj.menu_obj
		interface_obj.menu_obj.update();

		//Return statement
		return interface_obj;
	}

	/**
	 * createBarChart() -  Creates a bar chart and returns it as an Object for adding to menu_elements in createContextMenu().
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name=""]
	 * @param {boolean} [arg0_options.raw_dimensions=false]
	 *
	 * @param {number} [arg0_options.height=3]
	 * @param {number} [arg0_options.width=3]
	 * @param {number} [arg0_options.x=0]
	 * @param {String} [arg0_options.x_axis_name=""]
	 * @param {number} [arg0_options.y=0]
	 * @param {String} [arg0_options.y_axis_name=""]
	 *
	 * @param {Array<number>} [arg0_options.data=[0]]
	 */
	function createBarChart (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//1. JS-end try/catch clause
		try {
			//Initialise options
			if (!options.data) options.data = [0];
			options.height = returnSafeNumber(options.height, 3);
			options.width = returnSafeNumber(options.width, 3);
			options.x = returnSafeNumber(options.x);
			if (options.x_axis_name == undefined)
				options.x_axis_name = (options.name) ? options.name : "";
			options.y = returnSafeNumber(options.y);
			if (options.y_axis_name == undefined) options.y_axis_name = "";

			//Declare local instance variables
			var actual_height = parseInt((!options.raw_dimensions) ?
				CFG.BUTTON_WIDTH*options.height : options.height);
			var actual_width = parseInt((!options.raw_dimensions) ?
				CFG.BUTTON_WIDTH*options.width : options.width);

			//2. Java-end try/catch clause
			try {
				var new_graph_obj = new Graph_Vertical(
					Graph_Vertical_Data_Type.CUSTOM, //(nType)
					options.x_axis_name, //(sTextX)
					options.y_axis_name, //(sTextY)
					parseInt(options.x), //(iPosX)
					parseInt(options.y), //(iPosY)
					actual_width, //(iWidth)
					actual_height, //(iHeight)
					true
				);

				//Call new_graph_obj.setData() after standardising List<Integer>
				if (typeof options.data[0] != "object") {
					var graph_data_list = new ArrayList();

					for (var i = 0; i < options.data.length; i++) {
						var local_data  = parseInt(options.data[i]);

						//Add to graph_data_list
						graph_data_list.add(new Integer(local_data));
					}
					new_graph_obj.setData(graph_data_list);
					new_graph_obj.buildData();
				} else {
					var graph_labels_list = new ArrayList();
					var graph_values_list = new ArrayList();

					for (var i = 0; i < options.data.length; i++) {
						var local_data = parseInt(options.data[i].value);

						//Add to graph_labels_list; graph_values_list
						graph_labels_list.add((options.data[i].label) ? options.data[i].label : "");
						graph_values_list.add(new Integer(local_data));
					}
					new_graph_obj.setDataLabels(graph_labels_list);
					new_graph_obj.setData(graph_values_list);
					new_graph_obj.buildData();
				}
			} catch (e) {
				print(e.stack);
			}

			//Return statement
			return new_graph_obj;
		} catch (e) {
			console.log(e.stack);
		}
	}

	/**
	 * createButton() - Creates a button and returns it as an Object for adding to menu_elements in createContextMenu().
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name]
	 * @param {boolean} [arg0_options.raw_dimensions=false] - Whether the width is not multiplied by CFG.BUTTON_WIDTH.
	 * @param {number} [arg0_options.height]
	 * @param {number} [arg0_options.width=2] - The width as multiplied by CFG.BUTTON_WIDTH.
	 * @param {number} [arg0_options.x=0]
	 * @param {number} [arg0_options.y=0]
	 *
	 * @param {String} [arg0_options.align="centre"] - Optional. Either 'left', 'centre', or 'right'.
	 * @param {boolean} [arg0_options.clickable=true]
	 * @param {Function} [arg0_options.special_function]
	 * @param {String} [arg0_options.tooltip]
	 *
	 * @returns {ButtonMain}
	 */
	function createButton (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		options.align = (options.align) ? options.align : "centre";
		options.clickable = (options.clickable != false) ? true : false;
		options.name = (options.name) ? options.name : "";
		options.height = returnSafeNumber(options.height);
		options.width = returnSafeNumber(options.width, 2);
		options.x = returnSafeNumber(options.x);
		options.y = returnSafeNumber(options.y);

		//Declare local instance variables
		var actual_height = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.height : options.height);
		var actual_width = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.width : options.width);

		var actual_text_position = -1;
			//Adjust actual_text_position
			if (options.align == "left")
				actual_text_position = 25;
			if (options.align == "right") {
				//Create phantom dummy_button_obj to calculate displayed text width from
				var dummy_button_obj = new ButtonMain(
					null, //(sText) Initial string
					0, //(fontID)
					actual_text_position, //(itextPositionX)
					parseInt(options.x), //(iPosX)
					parseInt(options.y), //(iPosY)
					actual_width, //(nWidth)
					options.clickable //(isClickable)
				);
				dummy_button_obj.setText(options.name);
				var dummy_button_width = dummy_button_obj.getTextWidth();

				actual_text_position = actual_width - 25 - dummy_button_width;
			}

		//Construct new_button_obj
		var new_button_obj;

		if (!options.height) {
			new_button_obj = new ButtonMain(
				null, //(sText) Initial string
				0, //(fontID)
				actual_text_position, //(itextPositionX)
				parseInt(options.x), //(iPosX)
				parseInt(options.y), //(iPosY)
				actual_width, //(nWidth)
				options.clickable //(isClickable)
			);
		} else {
			new_button_obj = new ButtonStatsRect_Active(
				null, //(sText) Initial string
				actual_text_position, //(posX)
				parseInt(options.x), //(iPosX)
				parseInt(options.y), //(iPosY)
				actual_width, //(nWidth)
				actual_height, //(nHeight)
				0 //(fontID)
			);
		}

		//Post-process handling
		//options.name
		new_button_obj.setText(options.name);

		//Return statement
		return new_button_obj;
	}

	/**
	 * createContextMenu() - Creates a new context menu to add for the current in-game screen.
	 * @param [arg0_options]
	 * @param {String} [arg0_options.anchor="top_left"] - Either 'bottom_left', 'bottom_right', 'top_left', or 'top_right'.
	 * @param {String} [arg0_options.id] - Random ID by default.
	 *
	 * @param {boolean} [arg0_options.can_close=true]
	 * @param {boolean} [arg0_options.do_not_display=false] - Whether to display the menu or simply return its form without .menu_obj;
	 * @param {boolean} [arg0_options.draggable=true]
	 * @param {boolean} [arg0_options.has_back_button=false]
	 * @param {boolean} [arg0_options.lock_hover=false]
	 * @param {String} [arg0_options.name] - If undefined, the MenuTitle is null instead.
	 * @param {boolean} [arg0_options.no_title=true] - Whether there is a title or not.
	 * @param {boolean} [arg0_options.pinned=false] - If the Menu is pinned such that it always sits at the front.
	 * @param {Array<String>|boolean|String} [arg0_options.persistent=false] - If the menu should persist across view changes. False by default.
	 * @param {boolean} [arg0_options.raw_coords=false] - Whether to skip auto-formatting and manually supply all coords. For use in non-vertical menus.
	 * @param {boolean} [arg0_options.resizeable=true]
	 *
	 * @param {number} [arg0_options.height]
	 * @param {number} [arg0_options.width]
	 * @param {number} [arg0_options.x]
	 * @param {number} [arg0_options.y]
	 *
	 * @param {Object} [arg0_options."input_key"]
	 *  @param {String} [arg0_options."input_key".name]
	 * 	@param {String} [arg0_options."input_key".type] - Either 'bar_chart'/'button'/'flag_button'/'large_flag_button'/'line_graph'/'minimap'/'pie_chart'/'pie_chart_with_stats'/'scroll_text'/'slider'/'text'.
	 * 	@param {number} [arg0_options."input_key".raw_coords=false] - Whether to use raw specified coords instead of autoformatting.
	 * 	@param {number} [arg0_options."input_key".raw_dimensions=false] - Whether to override default multiplication for .width.
	 * 	@param {number} [arg0_options."input_key".height=2] - The height as multiplied by CFG.BUTTON_WIDTH.
	 * 	@param {number} [arg0_options."input_key".width=2] - The width as multiplied by CFG.BUTTON_WIDTH.
	 * 	@param {number} [arg0_options."input_key".x]
	 * 	@param {number} [arg0_options."input_key".y]
	 *
	 *  @param {String} [arg0_options."input_key".align="centre"] - Optional. Either 'left', 'centre', or 'right'.
	 *  @param {boolean} [arg0_options.clickable=true]
	 *  @param {Function} [arg0_options."input_key".special_function]
	 *  @param {String} [arg0_options."input_key".tooltip]
	 *
	 * @returns {{id: String, menu_elements: Array<MenuElement>, menu_flags: {}, menu_properties: {}, menu_obj: Menu}}
	 */
	function createContextMenu (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		if (!options.anchor) options.anchor = "top_left";
		if (options.can_close != false) options.can_close = true;
		if (options.draggable != false) options.draggable = true;
		if (options.has_back_button != true) options.has_back_button = false;
		if (options.lock_hover != true) options.lock_hover = false;
		if (options.no_title != false) options.no_title = true;
		if (!options.name) options.name = "";
		if (options.raw_coords != true) options.raw_coords = false;
		if (options.resizeable != false) options.resizeable = true;

		options.height = (options.height) ?
			returnSafeNumber(options.height, 100) : CFG.GAME_HEIGHT;
		options.width = (options.width) ?
			returnSafeNumber(options.width, 100) : CFG.GAME_WIDTH;
		options.x = returnSafeNumber(options.x);
		options.y = returnSafeNumber(options.y);

		//Declare local instance variables
		var all_options_keys = Object.keys(options);
		var menu_obj = new Menu();

		var current_view_id = Game.menuManager.viewID;
		var init_menu_method = menu_obj.getClass().getDeclaredMethod(
			"initMenu",
			MenuTitle.class,
			java.lang.Integer.TYPE,
			java.lang.Integer.TYPE,
			java.lang.Integer.TYPE,
			java.lang.Integer.TYPE,
			java.util.List.class,
			java.lang.Boolean.TYPE,
			java.lang.Boolean.TYPE,
			java.lang.Boolean.TYPE,
			java.lang.Boolean.TYPE
		);
			init_menu_method.setAccessible(true);
		var interface_obj = initInterface((!options.do_not_display) ? options.id : "cache");
		var menu_elements_array_list = new ArrayList();
		var menu_elements = [];
		var menu_properties = [];

		//Construct MenuTitle
		var menu_title_obj = (options.no_title) ? null : createMenuTitle({
			name: options.name,
			draggable: options.draggable,
			resizeable: options.resizeable
		});

		//Construct Menu dimensions; positioning
		if (options.anchor == "top_right") {
			options.x = getJavaInteger(CFG.GAME_WIDTH) - options.x;
		} else if (options.anchor == "bottom_left") {
			options.y = getJavaInteger(CFG.GAME_HEIGHT) - options.y;
		} else if (options.anchor == "bottom_right") {
			options.x = getJavaInteger(CFG.GAME_WIDTH) - options.x;
			options.y = getJavaInteger(CFG.GAME_HEIGHT) - options.y;
		}

		//1. Iterate over all_options_keys that are subobjects; fix their .x/.y coordinates if unspecified
		var column_one_current_rows = getRowsInColumn(options, 0);

		for (var i = 0; i < all_options_keys.length; i++) {
			var local_value = options[all_options_keys[i]];

			if (typeof local_value == "object" && local_value.type) {
				if (local_value.x == undefined)
					local_value.x = 0;
				if (local_value.y == undefined) {
					local_value.y = JSON.parse(JSON.stringify(column_one_current_rows));
					column_one_current_rows++;
				}
			}
		}

		//2. Iterate over all_options_keys that are subobjects; add them to the menu
		for (var i = 0; i < all_options_keys.length; i++) {
			var local_value = options[all_options_keys[i]];

			if (typeof local_value == "object" && local_value.type) {
				var new_menu_element_obj;

				//Parse type
				if (local_value.type == "bar_chart") {
					new_menu_element_obj = createBarChart(local_value);
				} else if (local_value.type == "button") {
					new_menu_element_obj = createButton(local_value);
				} else if (local_value.type == "empty" || local_value.type == "margin") {
					new_menu_element_obj = createMargin(local_value);
				} else if (local_value.type == "flag_button") {
					new_menu_element_obj = createFlagButton(local_value);
				} else if (local_value.type == "large_flag_button") {
					new_menu_element_obj = createLargeFlagButton(local_value);
				} else if (local_value.type == "line_graph") {
					new_menu_element_obj = createLineGraph(local_value);
				} else if (local_value.type == "minimap") {
					new_menu_element_obj = createMinimap(local_value);
				} else if (local_value.type == "pie_chart") {
					new_menu_element_obj = createPieChart(local_value);
				} else if (local_value.type == "pie_chart_with_stats") {
					new_menu_element_obj = createPieChartWithStats(local_value);
				} else if (local_value.type == "scroll_text") {
					new_menu_element_obj = createScrollText(local_value);
				} else if (local_value.type == "slider") {
					new_menu_element_obj = createSlider(local_value);
				} else if (local_value.type == "text") {
					new_menu_element_obj = createText(local_value);
				}

				if (new_menu_element_obj) {
					var local_menu_elements = getList(new_menu_element_obj);

					for (var x = 0; x < local_menu_elements.length; x++) {
						menu_elements.push(local_menu_elements[x]);
						var new_properties_obj = {};

						//Push new_properties_obj
						new_properties_obj.id = all_options_keys[i];
						new_properties_obj.x = local_value.x;
						new_properties_obj.y = local_value.y;

						if (local_value.special_function)
							new_properties_obj.onclick = local_value.special_function;
						menu_properties.push(new_properties_obj);
					}
				}
			}
		}

		//3. Set .interface_obj
		interface_obj.menu_elements = menu_elements;
		interface_obj.menu_flags = {
			persistent: (options.persistent),
			pinned: (options.pinned)
		};
		interface_obj.menu_properties = menu_properties;

		//4. Autoformat interface_obj.menu_obj with table layout
		if (!options.raw_coords) {
			var current_x_width = 0;
			var current_y_height = 0;
			var menu_dimensions = getContextMenuDimensions(options);

			//Set .x
			for (var i = 0; i < menu_dimensions[0] + 1; i++) {
				for (var x = 0; x < interface_obj.menu_properties.length; x++)
					if (!interface_obj.menu_properties[x].raw_coords)
						if (interface_obj.menu_properties[x].x == i)
							interface_obj.menu_elements[x].setPosX(current_x_width);
				current_x_width += getMaxColumnWidth(interface_obj, i);
			}

			//Set .y
			//Iterate over all_options_keys and set local y height per row
			for (var i = 0; i < menu_dimensions[1] + 1; i++) {
				//console.log("Iterating over Y: " + i);
				for (var x = 0; x < interface_obj.menu_properties.length; x++)
					//console.log(interface_obj.menu_properties[x]);
					if (!interface_obj.menu_properties[x].raw_coords) {
						if (interface_obj.menu_properties[x].y == i)
							interface_obj.menu_elements[x].setPosY(current_y_height);

						//console.log("Iterating over current_y_height: " + current_y_height);
					}
				current_y_height += getMaxRowHeight(interface_obj, i);
			}
		}

		//Return statement
		if (options.do_not_display) {
			delete main.interfaces.cache; //Make sure to delete the cache interface used.

			return interface_obj;
		}

		//Initialise menu and add to view
		for (var i = 0; i < interface_obj.menu_elements.length; i++)
			menu_elements_array_list.add(interface_obj.menu_elements[i]);

		init_menu_method.invoke(
			menu_obj,
			menu_title_obj, //(menuTitle)
			setJavaInteger(options.x), //(iPosX)
			setJavaInteger(options.y), //(iPosY)
			setJavaInteger(options.width), //(iWidth)
			setJavaInteger(options.height), //(iHeight)
			menu_elements_array_list, //(menuElements)
			true, //(visible)
			options.has_back_button, //(initWithBackButton)
			options.can_close, //(closeable)
			options.lock_hover); //(lockHoverOverMenuBackground)
		//If interface_obj.menu_obj was already there, call .setVisible(false) on it
		if (interface_obj.menu_obj)
			interface_obj.menu_obj.setVisible(false);

		//Add trackers to main.interfaces[<interface_id>]
		interface_obj.menu_obj = menu_obj;

		//KEEP AT BOTTOM! Update Game menu draw so that UI appears on screen
		var raw_menu_id = Game.menuManager.addNextMenuToView(current_view_id, menu_obj);
		Game.menuManager.setOrderOfMenu(current_view_id); //This is needed to refresh the menu order

		menu_obj.setWidth_Resize(options.width); //Update scrollable
		menu_obj.updateScrollable();

		interface_obj.raw_id = raw_menu_id;

		//Return statement
		return interface_obj;
	}

	/**
	 * createDummyMenu() - Creates a dummy testing menu.
	 * @param [arg0_options]
	 * @param [arg0_options.name="Test Window"]
	 *
	 * @returns {Object}
	 */
	function createDummyMenu (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Intialise options
		if (!options.name) options.name = "Test Window";

		//Dummy code
		var dummy_interface_obj = createContextMenu({
			name: options.name,
			no_title: false,
			height: 200,
			width: 400,
			x: 500,
			y: 400,

			text_test: {
				type: "text",
				name: "This is a test",

				align: "left",
				font_weight: 700,
				height: 70,
				raw_dimensions: true,
				width: 400
			},
			neu_button: {
				type: "flag_button",
				civilisation: "neu",
				raw_dimensions: true,
				height: 40,
				width: 400
			},
			left_align_button: {
				type: "button",
				name: "Left-aligned button",
				raw_dimensions: true,
				height: 40,
				width: 400,

				align: "left",
				special_function: function () {
					console.log("Left-aligned dummy menu test button reporting for duty!");
				}
			},
			centre_align_button: {
				type: "button",
				name: "Centre-aligned button",
				raw_dimensions: true,
				width: 400,

				align: "centre",
				special_function: function () {
					console.log("Centre-aligned dummy menu test button reporting for duty!");
				}
			},
			right_align_button: {
				type: "button",
				name: "Right-aligned button",
				raw_dimensions: true,
				width: 400,

				align: "right",
				special_function: function () {
					console.log("Right-aligned dummy menu test button reporting for duty!");
				}
			},
			slider_element: {
				type: "slider",
				name: "Test",
				raw_dimensions: true,
				height: 80,
				width: 400,

				min: 0,
				max: 100,
				placeholder: 50,
				special_function: function (e) {

				}
			},
			bar_chart_element: {
				type: "bar_chart",
				height: 400,
				raw_dimensions: true,
				width: 400,
				x_axis_name: "Test",
				y_axis_name: "Test",

				data: [
					{
						label: "Test",
						value: 1
					},
					{
						label: "Help",
						value: 2
					},
					{
						label: "Test",
						value: 1
					},
					{
						label: "Help",
						value: 2
					},
					{
						label: "Test",
						value: 1
					},
					{
						label: "Help",
						value: 2
					}
				]
			}
			/*line_graph_element: {
				type: "line_graph",
				height: 400,
				raw_dimensions: true,
				width: 400,
				x_axis_name: "Test",
				y_axis_name: "Test",

				data: [
					{
						values: [1, 2, 3, 4, 5]
					},
					{
						values: [5, 4, 3, 2, 1]
					}
				]
			}*/
		});

		//Return statement
		return dummy_interface_obj.menu_obj;
	}

	/**
	 * createFlagButton() - Creates a flag button for a context menu.
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name] - The name of the civilisation by default.
	 * @param {String} [arg0_options.align="centre"]
	 * @param {String} [arg0_options.civilisation="neu"] - The civilisation to create the FlagButton for.
	 * @param {boolean} [arg0_options.raw_dimensions=false]
	 * @param {number} [arg0_options.height]
	 * @param {number} [arg0_options.width=2]
	 * @param {number} [arg0_options.x=0]
	 * @param {number} [arg0_options.y=0]
	 *
	 * @returns {Object<MenuElement>}
	 */
	function createFlagButton (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		if (!options.civilisation) options.civilisation = "neu";
		options.height = returnSafeNumber(options.height);
		options.width = returnSafeNumber(options.width, 2);

		//Declare local instance variables
		var actual_height = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.height : options.height);
		var actual_name = (options.name) ? options.name : getCivilisationName(options.civilisation);
		var actual_width = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.width : options.width);
		var civilisation_id = getCivilisationID(options.civilisation);

		var actual_text_position = -1;
		//Adjust actual_text_position
		if (options.align == "left")
			actual_text_position = 25;
		if (["centre", "right"].includes(options.align)) {
			//Create phantom dummy_flag_button_obj to calculate displayed text width from
			var dummy_flag_button_obj = new Text_StaticBG_ID_FlagCiv(
				null, //(sText) Initial string
				0, //(fontID)
				actual_text_position, //(iTextPositionX)
				parseInt(options.x), //(iPosX)
				parseInt(options.y), //(iPosY)
				actual_width, //(nWidth)
				actual_height, //(nHeight),
				civilisation_id //(id)
			);
			dummy_flag_button_obj.setText(actual_name);
			var dummy_flag_button_width = dummy_flag_button_obj.getTextWidth();

			if (options.align == "centre")
				actual_text_position = parseInt(options.width - dummy_flag_button_width/2);
			if (options.align == "right")
				actual_text_position = parseInt(actual_width - 25 - dummy_flag_button_width);
		}

		//Construct new_flag_button_obj
		var new_flag_button_obj;

		new_flag_button_obj = new Text_StaticBG_ID_FlagCiv(
			null, //(sText) Initial string
			0, //(fontID)
			actual_text_position, //(iTextPositionX)
			parseInt(options.x), //(iPosX)
			parseInt(options.y), //(iPosY)
			actual_width, //(nWidth)
			actual_height, //(nHeight)
			civilisation_id //(id)
		);

		//Post-process handling
		//options.name
		new_flag_button_obj.setText(actual_name);

		//Return statement
		return new_flag_button_obj;
	}

	/**
	 * createLargeFlagButton() - Creates a large flag button for a context menu.
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.civilisation="neu"] - The civilisation to create the LargeFlagButton for.
	 * @param {number} [arg0_options.x=0]
	 * @param {number} [arg0_options.y=0]
	 * @param {boolean} [arg0_options.is_clickable=true]
	 *
	 * @returns {Object<MenuElement>}
	 */
	function createLargeFlagButton (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		if (!options.civilisation) options.civilisation = "neu";
		if (options.is_clickable == undefined) options.is_clickable = true;
		options.x = returnSafeNumber(options.x);
		options.y = returnSafeNumber(options.y)

		//Declare local instance variables
		var civilisation_id = getCivilisationID(options.civilisation);
		var new_button_obj = new ButtonFlag2_CivName(
			civilisation_id, //(iCivID)
			parseInt(options.x),
			parseInt(options.y),
			options.is_clickable
		);

		//Return statement
		return new_button_obj;
	}

	/**
	 * createLineGraph() - Creates a line graph for a context menu.
	 * @param {Object} [arg0_options]
	 * @param {Array<{civilisation: Object|number|String, start: 0|number, values: Array<number>}>} [arg0_options.data]
	 * @param {boolean} [arg0_options.display_float=false]
	 * @param {number} [arg0_options.height=3]
	 * @param {String} [arg0_options.name=""]
	 * @param {number} [arg0_options.width=3]
	 * @param {number} [arg0_options.x=0]
	 * @param {String} [arg0_options.x_axis_name=""]
	 * @param {number} [arg0_options.y=0]
	 * @param {String} [arg0_options.y_axis_name=""]
	 *
	 * @returns {Object<MenuElement>}
	 */
	function createLineGraph (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		//1. JS-end try/catch clause
		try {
			if (!options.data) options.data = [];
			if (options.display_float == undefined) options.display_float = false;
			options.height = returnSafeNumber(options.height, 3);
			options.width = returnSafeNumber(options.width, 3);
			options.x = returnSafeNumber(options.x);
			if (options.x_axis_name == undefined) options.x_axis_name = "";
			options.y = returnSafeNumber(options.y);
			if (options.y_axis_name == undefined)
				options.y_axis_name = (options.name) ? options.name : "";

			//Declare local instance variables
			var actual_height = parseInt((!options.raw_dimensions) ?
				CFG.BUTTON_WIDTH*options.height : options.height);
			var actual_width = parseInt((!options.raw_dimensions) ?
				CFG.BUTTON_WIDTH*options.width : options.width);

			var new_graph_obj = new Graph(
				options.x_axis_name, //(sTextX)
				options.y_axis_name, //(sTextY)
				options.x, //(iPosX)
				options.y, //(iPosY)
				actual_width, //(iWidth)
				actual_height, //(iHeight)
				true, //(visible)
				options.data.length, //(nLoadSize)
				Graph.GraphType.PLAYER_INCOME, //(graphType)
				options.display_float //(split100)
			);

			//Call new_graph_obj.setData() after standardising .civilisation for each entry point
			var graph_data_list = new ArrayList();

			for (var i = 0; i < options.data.length; i++) {
				var local_data = options.data[i];
				var local_graph_data_points = new ArrayList();

				//Set local_data.civilisation, .start
				if (!local_data.civilisation) local_data.civilisation = "neu";
				var local_civilisation_id = getCivilisationID(local_data.civilisation);

				local_data.civilisation = local_civilisation_id;
				local_data.start = returnSafeNumber(local_data.start);

				//Set local_data.values
				local_data.values = getList(local_data.values);
				for (var x = 0; x < local_data.values.length; x++)
					local_graph_data_points.add(new Integer(parseInt(local_data.values[x])));

				//Construct local_graph_data; add to graph_data_list
				var local_graph_data = new GraphData(
					new Integer(local_civilisation_id), //(iCivID)
					local_graph_data_points, //(nPointsY)
					new Integer(local_data.start) //(iBeginTurnID)
				);
				graph_data_list.add(local_graph_data);
				//new_graph_obj.lPointsPosX = local_graph_data_points;
			}
			new_graph_obj.setData(graph_data_list);
			new_graph_obj.buildGraph();

			//Return statement
			return new_graph_obj;
		} catch (e) {
			console.log(e.stack);
		}
	}

	/**
	 * createMargin() - Creates an empty margin block.
	 * @param {Object} [arg0_options]
	 *  @param {number} [arg0_options.height=0]
	 *  @param {number} [arg0_options.width=2]
	 *  @param {number} [arg0_options.x=0]
	 *  @param {number} [arg0_options.y=0]
	 *
	 *  @param {boolean} [arg0_options.raw_dimensions=false]
	 *
	 * @returns {Object<MenuElement>}
	 */
	function createMargin (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		options.height = returnSafeNumber(options.height);
		options.width = returnSafeNumber(options.width, 2);

		//Declare local instance variables
		var actual_height = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.height : options.height);
		var actual_width = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.width : options.width);

		//Construct new_blank_obj
		var new_blank_obj;

		new_blank_obj = new Empty(
			parseInt(options.x),
			parseInt(options.y),
			actual_width,
			actual_height
		);

		//Return statement
		return new_blank_obj;
	}

	/**
	 * createMenuTitle() - Creates a MenuTitle for an open menu.
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name]
	 *
	 * @param {boolean} [arg0_options.draggable=true]
	 * @param {number} [arg0_options.font_size=1.0]
	 * @param {number} [arg0_options.height=CFG.BUTTON_HEIGHT + CFG.BUTTON_HEIGHT/2]
	 * @param {boolean} [arg0_options.resizeable=true]
	 *
	 * @returns {MenuTitle}
	 */
	function createMenuTitle (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		if (!options.name) options.name = "";
		if (options.draggable != false) options.draggable = true;
		if (!options.font_size) options.font_size = (options.font_size) ?
			new Float(options.font_size) : new Float(1.0);
		if (!options.height) options.height = (options.height) ?
			returnSafeNumber(options.height) : CFG.BUTTON_HEIGHT + CFG.BUTTON_HEIGHT/2;
		if (options.resizeable != false) options.resizeable = true;

		//Declare local instance variables
		var new_menu_title_obj = new MenuTitle(
			"", //(sText)
			options.font_size, //(fontScale)
			options.height, //(titleHeight)
			options.draggable, //(moveable)
			options.resizeable //(resizable)
		);
		new_menu_title_obj.setText(options.name);

		//Return statement
		return new_menu_title_obj;
	}

	/**
	 * createMinimap() - Creates a minimap and returns it as an Object for adding to menu_elements in createContextMenu().
	 * @param {Object} [arg0_options]
	 * @param {number} [arg0_options.x=0]
	 * @param {number} [arg0_options.y=0]
	 *
	 * @returns {Object<MenuElement>}
	 */
	function createMinimap (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		options.x = returnSafeNumber(options.x);
		options.y = returnSafeNumber(options.y);

		//Declare local instance variables
		var ExtendedMinimap = Java.extend(Minimap, {
			getPosX: function () {
				return (new Integer(options.x));
			},
			getPosY: function () {
				return (new Integer(options.y));
			}
		});
		var extended_minimap_obj = new ExtendedMinimap(new Integer(options.x), new Integer(options.y));

		//Return statement
		return extended_minimap_obj;
	}

	/**
	 * createPieChart() - Creates a pie chart and returns it as an Object for ading to menu_elements in createContextMenu().
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name]
	 * @param {boolean} [arg0_options.raw_dimensions=false]
	 * @param {String} [arg0_options.type="pie_chart"] - Either 'pie_chart'/'pie_chart_with_stats'.
	 *
	 * @param {number} [arg0_options.height=2]
	 * @param {number} [arg0_options.width=2]
	 * @param {number} [arg0_options.x=0]
	 * @param {number} [arg0_options.y=0]
	 *
	 * @param {Array<{civilisation: "neu"|String, value: 0|number}>} [arg0_options.data=[]]
	 *
	 * @returns {Object<MenuElement>}
	 */
	function createPieChart (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		if (!options.data) options.data = [];
		options.height = returnSafeNumber(options.height, 2);
		options.x = returnSafeNumber(options.x);
		options.width = returnSafeNumber(options.width, 2);
		options.y = returnSafeNumber(options.y);
		if (!options.name) options.name = "";
		if (options.raw_dimensions == undefined) options.raw_dimensions = false;
		if (!options.type) options.type = "pie_chart";

		//Declare local instance variables
		var actual_height = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.height : options.height);
		var actual_width = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.width : options.width);

		//1. Regularise options.data
		for (var i = 0; i < options.data.length; i++) {
			if (!options.data[i].civilisation) options.data[i].civilisation = "neu";
			options.data[i].value = returnSafeNumber(options.data[i].value);

			//Set options.data[i].civilisation to civilisation_id
			var civilisation_id = getCivilisationID(options.data[i].civilisation);
			options.data[i].civilisation = civilisation_id;
		}

		//2. Pre-build MenuElement_Hover for use in PieChart
		var hover_element_options = {};

		for (var i = 0; i < options.data.length; i++)
			hover_element_options[i] = {
				type: "text",
				name: parseNumber(options.data[i].value, { display_float: true }).toString(),

				civilisation: options.data[i].civilisation
			};
		var hover_menu_obj = createTooltip(hover_element_options);

		//3. Build PieChart_Data nPieChartData
		var pie_chart_data_obj = new PieChart_Data();

		//Add pie chart values
		for (var i = 0; i < options.data.length; i++) {
			var local_value = options.data[i];

			var local_pie_chart_value_obj = new PieChart_Value(local_value.civilisation, local_value.value);
			pie_chart_data_obj.addPieChartValues(addPieChartValues);
		}

		//4. Build and return PieChart
		var pie_chart_obj;

		if (options.type == "pie_chart") {
			pie_chart_obj = new PieChart(
				parseInt(options.x), //(iPosX)
				parseInt(options.y), //(iPosY)
				parseInt(actual_width), //(iWidth)
				parseInt(actual_height), //(iHeight)
				pie_chart_data_obj, //(PieChart_Data)
				hover_menu_obj.menu_obj //(menuElementHover)
			);
		} else {
			pie_chart_obj = new PieChart_WithStats(
				parseInt(options.x), //(iPosX)
				parseInt(options.y), //(iPosY)
				parseInt(actual_width), //(iWidth)
				parseInt(actual_height), //(iHeight)
				pie_chart_data_obj, //(PieChart_Data)
				hover_menu_obj.menu_obj //(menuElementHover)
			);
		}


		//Return statement
		return pie_chart_obj;
	}

	/**
	 * createPieChartWithStats() - Creates a pie chart with stats and returns it as an Object for ading to menu_elements in createContextMenu().
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name]
	 * @param {boolean} [arg0_options.raw_dimensions=false]
	 *
	 * @param {number} [arg0_options.height=2]
	 * @param {number} [arg0_options.width=2]
	 * @param {number} [arg0_options.x=0]
	 * @param {number} [arg0_options.y=0]
	 *
	 * @param {Array<{civilisation: "neu"|String, value: 0|number}>} [arg0_options.data=[]]
	 *
	 * @returns {Object<MenuElement>}
	 */
	function createPieChartWithStats (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		options.type = "pie_chart_with_stats";

		//Declare local instance variables
		var pie_chart_obj = createPieChart(options);

		//Return statement
		return pie_chart_obj;
	}

	/**
	 * createScrollText() - Creates scrollable text and returns it as an Object for adding to menu_elements in createContextMenu().
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name]
	 * @param {boolean} [arg0_options.raw_dimensions=false]
	 *
	 * @param {Object} [arg0_options.height=0.5]
	 * @param {Object} [arg0_options.width=2]
	 * @param {String} [arg0_options.align="left"] - Optional. Either 'left'/'centre'/'right'.
	 * @param {Array<number, number, number>} [arg0_options.colour=[255, 255, 255, 1]]
	 * @param {number} [arg0_options.font_size=11]
	 *
	 * @returns {Object<MenuElement>}
	 */
	function createScrollText (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		if (!options.name) options.name = null;
		if (options.raw_dimensions == undefined) options.raw_dimensions = false;
		options.height = returnSafeNumber(options.height, 0.5);
		options.width = returnSafeNumber(options.width, 2);
		if (!options.align) options.align = "left";
		if (!options.colour) options.colour = [255, 255, 255, 1];
			if (options.colour.length == 3) options.colour[3] = 1;
		if (!options.font_size) options.font_size = 11;

		//Declare local instance variables
		var actual_colour = convertRGBA(actual_colour);
		var actual_height = parseInt((!options.raw_dimensions) ?
			options.height*CFG.BUTTON_WIDTH : options.height);
		var actual_font_size = options.font_size/11;
		var actual_width = parseInt((!options.raw_dimensions) ?
			options.width*CFG.BUTTON_WIDTH : options.width);

		var actual_text_position = -1;
		//Adjust actual_text_position
		if (options.align == "left")
			actual_text_position = 25;
		if (["centre", "right"].includes(options.align)) {
			//Create phantom dummy_scroll_text_obj to calculate displayed text width from
			var dummy_scroll_text_obj = new Text_Scrollable(
				null, //(sText) Initial string
				parseInt(options.x), //(iPosX)
				parseInt(options.y), //(iPosY)
				actual_width, //(iWidth)
				actual_height, //(iHeight)
				new Color(convertRGBAToInt(actual_colour)), //(textColor)
				actual_font_size, //(nTextScale)
				actual_text_position //(iTextPosition)
			);
			dummy_scroll_text_obj.setText(options.name);
			var dummy_scroll_text_width = dummy_scroll_text_obj.getTextWidth();

			if (options.align == "centre")
				actual_text_position = parseInt(options.width - dummy_scroll_text_width/2);
			if (options.align == "right")
				actual_text_position = parseInt(actual_width - 25 - dummy_scroll_text_width);
		}

		//Construct new_scroll_text_obj
		var new_scroll_text_obj;

		new_scroll_text_obj = new Text_Scrollable(
			null, //(sText) Initial string
			parseInt(options.x), //(iPosX)
			parseInt(options.y), //(iPosY)
			actual_width, //(iWidth)
			actual_height, //(iHeight)
			new Color(convertRGBAToInt(actual_colour)), //(textColor)
			actual_font_size, //(nTextScale)
			actual_text_position //(iTextPosition)
		);
		new_scroll_text_obj.setText(options.name);

		//Return statement
		return new_scroll_text_obj;
	}

	/**
	 * createSlider() - Creates a slider and returns it as an Object for adding to menu_elements in createContextMenu().
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name]
	 * @param {boolean} [arg0_options.raw_dimensions=false]
	 *
	 * @param {number} [arg0_options.height=1]
	 * @param {number} [arg0_options.max=100]
	 * @param {number} [arg0_options.min=0]
	 * @param {number} [arg0_options.placeholder=0]
	 * @param {number} [arg0_options.width=2]
	 * @param {number} [arg0_options.x=0]
	 * @param {number} [arg0_options.y=0]
	 */
	function createSlider (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		options.height = returnSafeNumber(options.height, 1);
		options.max = returnSafeNumber(options.max, 100);
		options.min = returnSafeNumber(options.min, 100);
		options.placeholder = returnSafeNumber(options.placeholder);
		options.width = returnSafeNumber(options.width, 2);
		options.x = returnSafeNumber(options.x);
		options.y = returnSafeNumber(options.y);

		if (!options.name) options.name = "";
		if (options.raw_dimensions == undefined) options.raw_dimensions = false;

		//Declare local instance variables
		var actual_height = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.height : options.height);
		var actual_width = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.width : options.width);

		var slider_obj = new Slider(
			options.name, //(sText)
			parseInt(options.x), //(iPosX)
			parseInt(options.y), //(iPosY)
			actual_width, //(iWidth)
			actual_height, //(iHeight)
			parseInt(options.min), //(iMin)
			parseInt(options.max), //(iMax)
			parseInt(options.placeholder) //(iCurrent)
		);

		//Return statement
		return slider_obj;
	}

	/**
	 * createText() - Creates static text and returns it as an Object for adding to menu_elements in createContextMenu().
	 * @param {Object} [arg0_options]
	 * @param {String} [arg0_options.name]
	 * @param {boolean} [arg0_options.raw_dimensions=false]
	 * @param {number} [arg0_options.height=0.5]
	 * @param {number} [arg0_options.font_weight=700] - Either '700' or '400'.
	 * @param {number} [arg0_options.margin=25]
	 * @param {number} [arg0_options.width=2]
	 * @param {number} [arg0_options.x=0]
	 * @param {number} [arg0_options.y=0]
	 *
	 * @param {String} [arg0_options.align="centre"] - Optional. Either 'left', 'centre', or 'right'.
	 */
	function createText (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};

		//Initialise options
		options.align = (options.align) ? options.align : "centre";
		options.name = (options.name) ? options.name : "";
		options.height = returnSafeNumber(options.height, 0.5);
		options.margin = returnSafeNumber(options.margin, 25);
		options.width = returnSafeNumber(options.width, 2);
		options.x = returnSafeNumber(options.x);
		options.y = returnSafeNumber(options.y);

		//Declare local instance variables
		var font_id_map = { "400": 1, "700": 0 };
		var local_menu_elements = [];

		var actual_font_id = font_id_map[options.font_weight.toString()];
		if (actual_font_id == undefined) actual_font_id = 0;
		var actual_height = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.height : options.height);
		var actual_width = parseInt((!options.raw_dimensions) ?
			CFG.BUTTON_WIDTH*options.width : options.width);
		var actual_text_position = -1;
		//Adjust actual_text_position
		if (options.align == "left")
			actual_text_position = options.margin;
		if (["centre", "right"].includes(options.align)) {
			//Create phantom dummy_button_obj to calculate displayed text width from
			var dummy_text_obj = new Text_Static(
				null, //(sText) Initial string
				actual_font_id, //(fontID)
				actual_text_position, //(itextPositionX)
				parseInt(options.x), //(iPosX)
				parseInt(options.y), //(iPosY)
				actual_width, //(nWidth)
				actual_height //(nHeight)
			);
			dummy_text_obj.setText(options.name);
			var dummy_text_width = dummy_text_obj.getTextWidth();

			if (options.align == "centre")
				actual_text_position = parseInt(actual_width - options.margin - dummy_button_width/2);
			if (options.align == "right")
				actual_text_position = actual_width - options.margin - dummy_button_width;
		}

		//Construct new_text_obj
		local_menu_elements.push(new Text_Static(
			null, //(sText) Initial string
			actual_font_id, //(fontID)
			actual_text_position, //(itextPositionX)
			parseInt(options.x), //(iPosX)
			parseInt(options.y), //(iPosY)
			actual_width, //(nWidth)
			54 //(nHeight)
		));
		local_menu_elements.push(new TextBG(
			null,
			0,
			parseInt(options.x),
			parseInt(options.y),
			actual_width,
			actual_height
		));

		//Post-process handling
		//options.name
		local_menu_elements[0].setText(options.name);

		//Return statement
		return local_menu_elements;
	}

	/**
	 * deleteElements() - Deletes elements from a ContextMenu Object given their element IDs.
	 * @param {String} arg0_interface_id - The interface ID to delete elements from.
	 * @param {Array<String>|String} arg1_element_ids - The element IDs to delete.
	 *
	 * @returns {{id: String, menu_elements: Array<MenuElement>, menu_flags: {}, menu_properties: {}, menu_obj: Menu}}
	 */
	function deleteElements (arg0_interface_id, arg1_element_ids) { //[WIP] - Modify to be compatible with new getElement()
		//Convert from parameters
		var interface_id = arg0_interface_id;
		var element_ids = getList(arg1_element_ids);

		//Declare local instance variables
		var interface_obj = (typeof interface_id != "object") ?
			main.interfaces[interface_id] : interface_id;

		//Set menuElements as being accessible
		var menu_class = interface_obj.menu_obj.getClass();
		var menu_elements_field = menu_class.getDeclaredField("menuElements");
		var menu_elements_size_field = menu_class.getDeclaredField("iMenuElementsSize");
		menu_elements_field.setAccessible(true);
		menu_elements_size_field.setAccessible(true);

		var menu_elements = menu_elements_field.get(interface_obj.menu_obj);
		var menu_elements_size = menu_elements_size_field.get(interface_obj.menu_obj);

		//Iterate over element_ids
		for (var i = element_ids.length - 1; i >= 0; i--) {
			var local_element = getElement(interface_obj, element_ids[i]);
			var local_remove_element = false;

			if (!isNaN(element_ids[i])) {
				local_remove_element = true;
			} else {
				if (local_element)
					local_remove_element = true;
			}

			if (local_remove_element) {
				var local_index = local_element.index;

				menu_elements.remove(element_ids[i]);
				interface_obj.menu_elements.splice(local_index, 1);
				interface_obj.menu_properties.splice(local_index, 1);
			}
		}

		//Update menu_elements_size; field must be set manually instead of assigned.
		menu_elements_size_field.set(interface_obj.menu_obj, menu_elements.size());

		//Return statement
		return interface_obj;
	}

	/**
	 * deleteInterface() - Deletes an interface/context menu currently on screen.
	 *
	 * @param {String} arg0_interface_id - The interface ID to remove.
	 */
	function deleteInterface (arg0_interface_id) {
		//Convert from parameters
		var interface_id = arg0_interface_id;

		//Declare local instance variables
		var interface_obj = (typeof interface_id == "object") ? interface_id : main.interfaces[interface_id];

		//Make sure interface_obj exists
		if (interface_obj) {
			//1. Close menu visually
			if (interface_obj.menu_obj) {
				interface_obj.menu_obj.setVisible(false);
				interface_obj.menu_obj.dispose();
				interface_obj.menu_obj.closeMenu();
			}

			//2. Close any _logic_loop keys
			var all_interface_keys = Object.keys(interface_obj);

			//Iterate over all_interface_keys
			for (var i = 0; i < all_interface_keys.length; i++)
				if (all_interface_keys[i].endsWith("_logic_loop")) {
					var local_value = interface_obj[all_interface_keys[i]];

					clearInterval(local_value);
				}

			//3. Delete interface
			delete main.interfaces[interface_obj.id];
		}
	}

	function getColourPickerValue () {
		//Declare local instance variables
		var colour_picker_obj = Game.menuManager.colorPicker;
		var colour_picker_value = colour_picker_obj.getActiveColor();

		//Return statement
		return [
			parseInt(colour_picker_value.r*255),
			parseInt(colour_picker_value.g*255),
			parseInt(colour_picker_value.b*255)
		];
	}

	/**
	 * getColumnsInRow() - Fetches the total number of columns in a row.
	 * @param {Object} arg0_context_menu_obj - The context menu to input.
	 * @param {number} arg1_y - The row to target.
	 *
	 * @returns {number}
	 */
	function getColumnsInRow (arg0_context_menu_obj, arg1_y) {
		//Convert from parameters
		var context_menu_obj = arg0_context_menu_obj;
		var row = parseInt(arg1_y);

		//Declare local instance variables
		var all_context_menu_keys = Object.keys(context_menu_obj);
		var max_column = 0;

		//Iterate over all_context_menu_keys
		for (var i = 0; i < all_context_menu_keys.length; i++) {
			var local_value = context_menu_obj[all_context_menu_keys[i]];

			if (local_value.y == row)
				max_column = Math.max(max_row, local_value.x + 1);
		}

		//Return statement
		return max_column;
	}

	/**
	 * getContextMenuDimensions() - Returns the [x, y] dimensions of the current context menu.
	 * @param {Object} arg0_context_menu_obj - The context menu to input.
	 *
	 * @returns {Array<number, number>}
	 */
	function getContextMenuDimensions (arg0_context_menu_obj) {
		//Convert from parameters
		var context_menu_obj = arg0_context_menu_obj;

		//Declare local instance variables
		var all_context_menu_keys = Object.keys(context_menu_obj);
		var max_x = 0;
		var max_y = 0;

		//Iterate over all_context_menu_keys
		for (var i = 0; i < all_context_menu_keys.length; i++) {
			var local_value = context_menu_obj[all_context_menu_keys[i]];

			if (typeof local_value == "object") {
				if (local_value.x) max_x = Math.max(max_x, local_value.x);
				if (local_value.y) max_y = Math.max(max_y, local_value.y);
			}
		}

		//Return statement
		return [max_x, max_y];
	}

	/**
	 * getElement() - Returns {.elements, .properties} after fetching a context menu element by its ID.
	 * @param {Object|String} arg0_interface_id - The interface object to input.
	 * @param {String} arg1_element_id - The .id key to search for.
	 * @param {Object} [arg2_options]
	 * @param {boolean} [arg2_options.return_indexes=false] - Whether to return indexes instead of objects.
	 *
	 * @returns {{elements: Array<MenuElement>, indexes: Array<number>, properties: Array<Object>}}
	 */
	function getElement (arg0_interface_id, arg1_element_id) {
		//Convert from parameters
		var interface_id = arg0_interface_id;
		var element_id = arg1_element_id;

		//Declare local instance variables
		var element_exists = [false, []]; //[element_exists, element_index];
		var interface_obj = (typeof interface_id != "object") ?
			main.interfaces[interface_id] : interface_id;
		var search_name = (typeof element_id == "string") ?
			element_id.toLowerCase().trim() : element_id;

		//ID search - hard search only
		{
			for (var i = 0; i < interface_obj.menu_elements.length; i++)
				if (interface_obj.menu_properties[i])
					if (interface_obj.menu_properties[i].id.toLowerCase() == search_name) {
						element_exists[0] = true;
						if (!element_exists[1].includes(i))
							element_exists[1].push(i);
					}
		}

		//Index search - hard search only
		{
			if (!isNaN(search_name))
				if (interface_obj.menu_properties[search_name]) {
					var local_id = interface_obj.menu_properties[search_name].id;

					for (var i = 0; i < interface_obj.menu_elements.length; i++)
						if (interface_obj.menu_properties[i].id.toLowerCase() == local_id) {
							element_exists[0] = true;
							if (!element_exists[1].includes(i))
								element_exists[1].push(i);
						}
				}
		}

		//Declare return_element; return_property.
		var return_elements = [];
		var return_properties = [];

		if (element_exists[0]) {
			for (var i = 0; i < element_exists[1].length; i++) {
				return_elements.push(interface_obj.menu_elements[element_exists[1][i]]);
				return_properties.push(interface_obj.menu_properties[element_exists[1][i]]);
			}
		}

		//Return statement
		return (element_exists[0]) ?
			{ elements: return_elements, indexes: element_exists[1], properties: return_properties } : undefined;
	}

	/**
	 * getMaxColumnWidth() - Fetches the maximal width of a given column needed for rendering.
	 * @param {Object} arg0_interface_obj - The interface object to input.
	 * @param {number} arg1_x - The column to target.
	 *
	 * @returns {number}
	 */
	function getMaxColumnWidth (arg0_interface_obj, arg1_x) {
		//Convert from parameters
		var interface_obj = arg0_interface_obj;
		var x_column = parseInt(arg1_x);

		//Declare local instance variables
		var max_column_width = 0;

		//Iterate over interface_obj.menu_properties
		if (interface_obj)
			if (interface_obj.menu_properties)
				for (var i = 0; i < interface_obj.menu_properties.length; i++)
					if (interface_obj.menu_properties[i].x == x_column && !interface_obj.menu_properties[i].raw_coords)
						max_column_width = Math.max(max_column_width, interface_obj.menu_elements[i].getWidth());

		//Return statement
		return max_column_width;
	}

	/**
	 * getMaxRowHeight() - Fetches the maximal height of a given row needed for rendering.
	 * @param {Object} arg0_interface_obj - The interface object to input.
	 * @param {number} arg1_y - The row to target.
	 *
	 * @returns {number}
	 */
	function getMaxRowHeight (arg0_interface_obj, arg1_y) {
		//Convert from parameters
		var interface_obj = arg0_interface_obj;
		var y_row = parseInt(arg1_y);

		//Declare local instance variables
		var max_row_height = 0;

		//Iterate over interface_obj.menu_properties
		if (interface_obj)
			if (interface_obj.menu_properties)
				for (var i = 0; i < interface_obj.menu_properties.length; i++)
					if (interface_obj.menu_properties[i].y == y_row && !interface_obj.menu_properties[i].raw_coords)
						max_row_height = Math.max(max_row_height, interface_obj.menu_elements[i].getHeight());

		//Return statement
		return max_row_height;
	}

	/**
	 * getRowsInColumn() - Fetches the total number of rows in a column.
	 * @param {Object} arg0_context_menu_obj - The context menu to input.
	 * @param {number} arg1_x - The column to target.
	 *
	 * @returns {number}
	 */
	function getRowsInColumn (arg0_context_menu_obj, arg1_x) {
		//Convert from parameters
		var context_menu_obj = arg0_context_menu_obj;
		var column = parseInt(arg1_x);

		//Declare local instance variables
		var all_context_menu_keys = Object.keys(context_menu_obj);
		var max_row = 0;

		//Iterate over all_context_menu_keys
		for (var i = 0; i < all_context_menu_keys.length; i++) {
			var local_value = context_menu_obj[all_context_menu_keys[i]];

			if (local_value.x == column)
				max_row = Math.max(max_row, local_value.y + 1);
		}

		//Return statement
		return max_row;
	}

	/**
	 * getTotalColumnHeight() - Fetches the total display column height for all elements  with no padding.
	 * @param {Object} arg0_interface_obj - The interface object to input.
	 * @param {number} arg1_x - The column to target.
	 *
	 * @returns {number}
	 */
	//[WIP] - Adjust for padding options
	function getTotalColumnHeight (arg0_interface_obj, arg1_x) {
		//Convert from parameters
		var interface_obj = arg0_interface_obj;
		var x_column = parseInt(arg1_x);

		//Declare local instance variables
		var total_column_height = 0;

		//Iterate over interface_obj.menu_properties
		if (interface_obj)
			if (interface_obj.menu_properties)
				for (var i = 0; i < interface_obj.menu_properties.length; i++)
					if (interface_obj.menu_properties[i].x == x_column)
						total_column_height += interface_obj.menu_elements[i].getHeight();

		//Return statement
		return total_column_height;
	}

	/**
	 * getTotalRowWidth() - Fetches the total display row width for all elements with no padding.
	 * @param {Object} arg0_interface_obj - The interface object to input.
	 * @param {number} arg1_y - The row to target.
	 *
	 * @returns {number}
	 */
	function getTotalRowWidth (arg0_interface_obj, arg1_y) {
		//Convert from parameters
		var interface_obj = arg0_interface_obj;
		var y_row = parseInt(arg1_y);

		//Declare local instance variables
		var total_row_width = 0;

		//Iterate over interface_obj.menu_properties
		if (interface_obj)
			if (interface_obj.menu_properties)
				for (var i = 0; i < interface_obj.menu_properties.length; i++)
					if (interface_obj.menu_properties[i].y == y_row)
						total_row_width += interface_obj.menu_elements[i].getWidth();

		//Return statement
		return total_row_width;
	}

	function hideColourPicker () {
		//Declare local instance variables
		var colour_picker_obj = Game.menuManager.colorPicker;

		//Hide colour picker
		colour_picker_obj.setVisible(false, null);
	}

	/**
	 * initialiseMenuLogic() - Internal helper function. Initialises menu logic upon game load.
	 */
	function initialiseMenuLogic () {
		main.menu_logic_loop = setInterval(function(){
			var all_interfaces = Object.keys(main.interfaces);
			var current_view_id = Game.menuManager.viewID;
			var number_of_menus = Game.menuManager.getNumberOfMenus();

			//Iterate over all_interfaces
			for (var i = 0; i < all_interfaces.length; i++) {
				var local_interface = main.interfaces[all_interfaces[i]];

				if (local_interface.menu_flags)
					if (local_interface.menu_flags.pinned && isCurrentlyPersistent(local_interface)) {
						if (!isNaN(local_interface.menu_flags.pinned)) {
							Game.menuManager.setOrderOfMenu(local_interface.raw_id, number_of_menus - returnSafeNumber(local_interface.menu_flags.pinned));
						} else {
							Game.menuManager.setOrderOfMenu(local_interface.raw_id, number_of_menus);
						}
					}
			}
		}, 100);
	}

	/**
	 * initInterface() - Creates a new interface at main.interfaces.
	 * @param {number} [arg0_interface_id] - The interface ID to create this in. Random untaken number by default.
	 *
	 * @returns {Object}
	 */
	function initInterface (arg0_interface_id) {
		//Convert from parameters
		var interface_id = (arg0_interface_id) ? arg0_interface_id : generateRandomID(main.interfaces);

		//Declare local instance variables
		if (!main.interfaces[interface_id])
			main.interfaces[interface_id] = {};
		var interface_obj = main.interfaces[interface_id];

		interface_obj.id = interface_id;
		interface_obj.menu_elements = []; //Stores all elements added to the current Menu (except MenuTitle)
		interface_obj.onclick = []; //Handles onclick elements (except MenuTitle)

		//Return statement
		return interface_obj;
	}

	/**
	 * isCurrentlyPersistent() - Checks whether the current ContextMenu Object is currently persistent.
	 * @param {String} arg0_interface_id - The interface ID to check for.
	 *
	 * @returns {boolean}
	 */
	function isCurrentlyPersistent (arg0_interface_id) {
		//Convert from parameters
		var interface_id = arg0_interface_id;

		//Declare local instance variables
		var current_page = getCurrentPage();
		var interface_obj = (typeof interface_id != "object") ?
			main.interfaces[interface_id] : interface_id;

		//Guard clause if interface_obj.menu_flags.persistent is a true boolean
		if (interface_obj)
			if (interface_obj.menu_flags)
				if (interface_obj.menu_flags.persistent == true)
					return true;

		//Check if it lines up with persistence
		if (interface_obj)
			if (interface_obj.menu_flags)
				if (interface_obj.menu_flags.persistent) {
					var persistent_views = getList(interface_obj.menu_flags.persistent);

					//Iterate over persistent_views and check if the current_page is one of them. If so, break and return.
					for (var i = 0; i < persistent_views.length; i++)
						if (current_page == persistent_views[i])
							return true;
				}
	}

	/**
	 * menuHandler() - Handles onclick events for menus in-game.
	 */
	function menuHandler (e) {
		try {
			//Declare local instance variables
			var all_interface_keys = Object.keys(main.interfaces);
			var current_view_id = Game.menuManager.viewID;

			//Iterate over all_interface_keys
			for (var i = 0; i < all_interface_keys.length; i++) try {
				var local_interface = main.interfaces[all_interface_keys[i]];
				var local_menu_obj = local_interface.menu_obj;

				if (local_menu_obj)
					//Handle local_interface.menu_elements
					for (var x = 0; x < local_interface.menu_elements.length; x++) try {
						var local_element = local_interface.menu_elements[x];
						var local_properties = local_interface.menu_properties[x];

						//Left click functionality
						if (e == "left_click")
							if (local_element.getIsHovered()) {
								//console.log("Clicked on button: " + local_element.getText());
								if (local_properties.onclick)
									local_properties.onclick({
										element: local_element,
										interface_obj: local_interface
									});
							}
					} catch (e) {
						console.error(e.stack);
					}
			} catch (e) {
				console.error(e.stack);
			}

			//Draw right-click context menus
			var hovered_province = getHoveredProvince();
			if (main.game_loaded && main.in_mod_editor)
				if (hovered_province != undefined)
					if (e == "left_click") {
						closeMapContextMenu(hovered_province.getProvinceID());
					} else if (e == "right_click") {
						openMapNavigationMenu(hovered_province.getProvinceID());
					}

			//Draw current menus
			Gdx.app.postRunnable(function(){
				Game.menuManager.update();
				Game.menuManager.setOrderOfMenu(current_view_id); //This is needed to refresh the menu order
			});
		} catch (e) {
			console.error(e.stack);
		}
	}

	/**
	 * modifyElement() - Modifies an element in a currently rendered ContextMenu Object.
	 * @param {String} arg0_interface_id - The interface ID to modify a MenuElement for.
	 * @param {number|String} arg1_element - The array index/element ID name to fetch for replacement.
	 * @param {Object} arg2_options - The context menu options for which to generate the new element. Note that only the first element will be accepted.
	 */
	function modifyElement (arg0_interface_id, arg1_element, arg2_options) { //[WIP] - Finish function body
		//Convert from parameters
		var interface_id = arg0_interface_id;
		var element = arg1_element;
		var options = (arg2_options) ? arg2_options : {};

		//Declare local instance variables

	}

	function openColourPicker (arg0_colour) {
		//Convert from parameters
		var colour = (arg0_colour) ? getList(arg0_colour) : [255, 255, 255];

		//Declare local instance variables
		Game.menuManager.initColorPicker();
		var colour_picker_obj = Game.menuManager.colorPicker;

		//Initialise colour picker
		colour_picker_obj.setVisible(true, null);
		colour_picker_obj.setActiveRGBColor(new Integer(colour[0]), new Integer(colour[1]), new Integer(colour[2]));
	}
}