export class MatchHistoryService {
    private apiURL: string = "https://lol-matches-react.herokuapp.com";
    private summonerURL: string = "/api/summoner";
    private matchHistoryURL: string = "/api/matchhistory" 
    private versionURL: string = "/api/version";
    private championsURL: string = "/api/champions";
    private spellsURL: string = "/api/spells";
    private runesURL: string = "/api/reforged";
    private matchMakingURL: string = "/api/matchmaking";

    public getMatchesByIgn(ign: string): Promise<any> {
        return fetch(this.apiURL + this.summonerURL + "?ign=" + ign)
            .then(response => {
                return response.json();
            });
    }

    public getMatchHistoryByIgn(ign: string): Promise<any> {
        return this.getMatchesByIgn(ign)
            .then((data: any) => {
                const summoner: any = JSON.parse(data);
                return fetch(this.apiURL + this.matchHistoryURL + "?id=" + summoner.accountId)
                    .then(response => {
                        return response.json();
                    })
            });         
    }

    public getLatestVersion(): Promise<any> {
        return fetch(this.apiURL + this.versionURL)
            .then(response => {
                return response.json();
            });
    }

    public getChampionImages(version: string): Promise<any> {
        return fetch(this.apiURL + this.championsURL + "?version=" + version)
            .then(response => {
                return response.json();
            });
    }

    public getSummonerSpells(version: string): Promise<any> {
        return fetch(this.apiURL + this.spellsURL + "?version=" + version)
            .then(response => {
                return response.json();
            });
    }

    public getSummonerRunes(version: string): Promise<any> {
        return fetch(this.apiURL + this.runesURL + "?version=" + version)
            .then(response => {
                return response.json();
            });
    }

    public getMatchMakingTitles(): Promise<any> {
        return fetch(this.matchMakingURL)
            .then(response => {
                return response.json();
            });
    }
}