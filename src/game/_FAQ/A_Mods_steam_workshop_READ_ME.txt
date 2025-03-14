#############################
## Steam Workshop
##
## When reading any file, the game will prioritize files in the 'mods/' folder first, followed by
## subscribed items from the Steam Workshop, and finally the default game files.
## 
## You can find all files for this example in the 'modsExample/' folder within the game files.
##
#####

To create a new mod that can be submitted to the Steam Workshop, create a new folder for your mod in the 'mods/' directory.

Inside this folder, organize your files in the same structure as they are found in the game's directories.

Example:

# Step 1

Create a new folder within the 'mods/' directory in the game files.
For this example, we'll name the folder 'MyOwnMod'.
Make sure the folder name is unique!

# Step 2

In the newly created folder (example path: mods/MyOwnMod/), create a text file named mod.txt.

## EXAMPLE CODE OF mod.txt file

{
	Name: "Two new Governments",
	Description: "This item will add two new Governments, and two flags.",
	
	Tags: [ "Map", "Government" ],
	
	ChangeNote: "First release",
}

## END OF EXAMPLE CODE OF mod.txt file

Copy it to mod.txt and edit it.

Set a name for your mod that will be visible in the Steam Workshop.

Name: "Your Title of the Mod in the Steam Workshop",

The same with Description and ChangeNote.


## Tags
In your tags, put the categories that your mod fits into


You can use as many tags as you like:
Tags: [ "FIRST_TAG", "SECOND_TAG", "THIRD_TAG" ],
Tags: [ "FIRST_TAG" ],

Example tags:

Tags: [ "Map", "Government" ],
Tags: [ "Scenario" ],
Tags: [ "Mod", "Laws", "Units", "Buildings" ],

# Step 3 - Main mod image: "logo.png"

In the same newly created folder: (Example path: mods/MyOwnMod/)

Place the main image file of the mod, which will be published on the Steam Workshop.

The mod's main image file must be named "logo.png".


# Step 4

We are already configured, now we can place the files that will be part of this mod in this folder.
We will create new governments for the game in this example.

## Basically, you create the file structure of the main game in the mod folder.


The Governments file is located in the path:
Game/Governments.json


So copy this file to the mod folder. Imporatant! : use the same path where you found this file.

mods/MyOwnMod/game/
## The file was in the game folder, so create a game folder inside the mod folder and place the copied file there.

If the "game" folder does not exist in the mod folder, create it. And there place Governments.json

Now when you launch the game, the game will load the Governments.json file from your mod. (Path of the file: mods/MyOwnMod/game/Governments.json)


# Step 5

Let's make some changes to the game!

Open Governments.json as a text file in Notepad.


### EXAMPLE CODE

		{
			Name: "YourGovernmentType",
			Extra_Tag: "k",
			GOV_GROUP_ID: 0,
			
			RulerTitle: King,
			RulerRoman: true,
			KingsImages: true,
			
			Color: [255, 194, 36],
			
			AVAILABLE_SINCE_AGE_ID: 0,
			
			REVOLUTIONISTS: false,
			
			AdvisorCost: -0.05,
			MonthlyLegacy: 0.35,
			MaxManpower: 1000,
		},
		
### EXAMPLE CODE END

You can add new Goverment from example code after any:
"		},"
in the file.


Add new Goveremnt to the file.
Extra_Tag: "k", (The tag should be unique)


To publish your mod to Steam Workshop, open the game, go to editor -> Steam Workshop -> and find your mod folder, click on it to publish.


## Update the mod

To update the mod, follow the same steps.
You can change "ChangeNote" description in mod.txt.

Do not delete the automatically created id.txt file!

To update a mod in the Steam Workshop, simply do the same thing as when you published the mod


#########
## Limit exceeded
Error While Publishing a Mod to the Steam Workshop

The logo.png file is too large. Reduce the image quality to decrease its size.