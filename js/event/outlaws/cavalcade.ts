import { WorldTime, GAME, TimeStep } from "../../GAME";
import { SetGameState, GameState } from "../../gamestate";
import { Gui } from "../../gui";
import { Text } from "../../text";
import { Entity } from "../../entity";
import { Party } from "../../party";
import { Cavalcade } from "../../cavalcade";

export namespace OCavalcadeScenes {
	export function Bet() {
		return 10; //TODO
	}
	export function Enabled() {
		return WorldTime().hour < 4 || WorldTime().hour >= 14;
	}

	export function PrepRandomCoinGame() {
		let player = GAME().player;
		let party : Party = GAME().party;
		
		var onEnd = function() {
			var parse : any = {
				playername : player.name
			};
			
			SetGameState(GameState.Event, Gui);
			
			TimeStep({minute: 5});
			
			Text.NL();
			if(OCavalcadeScenes.Enabled()) {
				Text.Add("<i>“Do you want to go for another game, [playername]?”</i>", parse);
				Text.Flush();
				
				//[Sure][Nah]
				var options = new Array();
				options.push({ nameStr : "Sure",
					func : function() {
						Text.NL();
						OCavalcadeScenes.PrepRandomCoinGame();
					}, enabled : party.coin >= OCavalcadeScenes.Bet(),
					tooltip : "Deal another round!"
				});
				options.push({ nameStr : "Nah",
					func : function() {
						Text.Clear();
						Text.Add("<i>“Alright, see you around!”</i> You leave the group, another outlaw soon taking your place.", parse);
						Text.Flush();
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Nah, this is enough Cavalcade for now."
				});
				Gui.SetButtonsFromList(options, false, null);
			}
			else {
				Text.Add("<i>“It’s getting late, how about we break this up?”</i> the lizan yawns, gathering up the cards. <i>“If you want another game later, just holler.”</i>", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}
		}
		
		player.purse  = party;
		var players = [player];
		
		for(var i = 0; i < 3; i++) {
			var ent : any = new Entity();
			
			ent.name = "Outlaw";
			ent.purse = { coin: 100 };
			if(Math.random() < 0.5)
				ent.body.DefMale();
			else
				ent.body.DefFemale();
			
			players.push(ent);
		}
		
		var g = new Cavalcade(players, {bet    : OCavalcadeScenes.Bet(),
										onPost : onEnd});
		g.PrepGame();
		g.NextRound();
	}
}
