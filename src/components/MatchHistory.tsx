import * as React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MatchHistoryService } from '../services/MatchHistory.service';
import './MatchHistory.css';

class MatchHistory extends React.Component<{}, { ign: string, version: string, champNames: any[], matchmaking: any[], spellPaths: any[], runePaths: any[], matches: any }> {
    protected matchHistoryService: MatchHistoryService;
    private ddragonCDN: string;
    private championPath: string;
    private spellPath: string;
    private itemPath: string;
    private farmPath: string;
    private iconVersion: string;
    private runePath: string;
    private defaultSummoner: string;

    constructor(props: any) {
        super(props);
        this.ddragonCDN = "http://ddragon.leagueoflegends.com/cdn/";
        this.championPath = "/img/champion/";
        this.spellPath = "/img/spell/";
        this.itemPath = "/img/item/";
        this.farmPath = "/img/ui/";
        this.runePath = "img/";
        this.iconVersion = "5.5.1";
        this.defaultSummoner = "MiyagiHan"
        this.state = {
            ign: '',
            version: '',
            champNames: [],
            matchmaking: [],
            spellPaths: [],
            runePaths: [],
            matches: {}
        };
        this.matchHistoryService = new MatchHistoryService();
        this.championTemplate = this.championTemplate.bind(this);
        this.itemsTemplate = this.itemsTemplate.bind(this);
        this.gameInfoTemplate = this.gameInfoTemplate.bind(this);
        this.kdaTemplate = this.kdaTemplate.bind(this);
        this.farmTemplate = this.farmTemplate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.summonerSearch = this.summonerSearch.bind(this);
    }

    public componentDidMount() {
        this.setState({ ign: this.defaultSummoner });
        this.loadSummonerGrid();
    }

    public render() {
        const matches = this.state.matches.games ? this.state.matches.games.games.sort((a: any, b: any) => {
            const keyA = new Date(a.gameCreation);
            const keyB = new Date(b.gameCreation);
            if (keyA > keyB) { return -1; }
            if (keyA < keyB) { return 1; }
            return 0;
        }) : [];

        return (
            <form onSubmit={this.summonerSearch}>
                <div className="p-grid">
                    <div className="float-logo animate-logo" />
                    <div className="p-col-12 search-content">
                        <div className="p-inputgroup" style={{ width: '80%', height: '50px' }}>
                            <InputText placeholder="Enter League of Legends Summoner IGN" style={{ width: '100%' }} value={this.state.ign} onChange={this.handleChange}  />
                            <Button icon="pi pi-search" type="submit" />
                        </div>
                    </div>
                    <div className="p-col-12 content">
                        <DataTable value={matches} selectionMode="single" className="table-width" responsive={true}>
                            <Column header="Champion" body={this.championTemplate} style={{ textAlign: 'center', width: '22em' }}/>
                            <Column header="Items" body={this.itemsTemplate} style={{ textAlign: 'center', width: '22em' }}/>
                            <Column header="Game Info" body={this.gameInfoTemplate} style={{ textAlign: 'center' }} />
                            <Column header="KDA" body={this.kdaTemplate} style={{ textAlign: 'center', width: '8em' }} />
                            <Column header="Farm" body={this.farmTemplate} style={{ textAlign: 'center', width: '8em' }} />
                        </DataTable>
                    </div>
                </div>
            </form>
        );
    }

    protected loadSummonerGrid() {
        this.matchHistoryService.getLatestVersion()
            .then((versionData: any) => {
                this.setState({ version: JSON.parse(versionData)[0] });

                this.matchHistoryService.getMatchHistoryByIgn(this.state.ign)
                    .then((historyData: any) => {
                        const minData: any = JSON.parse(historyData);
                        this.getMatchMakingTitles();
                        this.getChampionImages(minData);
                        this.getSummonerSpells(minData);
                        this.getSummonerRunes(minData);
                        this.setState({ matches: minData });
                    });
            });
    }
    
    protected championTemplate(rowData: any, column: any) {
        if (!this.state.champNames || this.state.champNames.length <= 0 || !this.state.spellPaths || this.state.spellPaths.length <= 0) {
            return;
        }
        const champData = this.state.champNames.filter(champs => champs.championId === rowData.participants[0].championId)[0];
        const spell1Data = this.state.spellPaths.filter(spell => spell.spell1Id === rowData.participants[0].spell1Id)[0];
        const spell2Data = this.state.spellPaths.filter(spell => spell.spell2Id === rowData.participants[0].spell2Id)[0];
        const level = rowData.participants[0].stats.champLevel;

        const isRunePathExists = !this.state.runePaths || this.state.runePaths.length > 0; 
        let runePrimary; 
        let runeSub;

        if (isRunePathExists) {
            runePrimary = this.state.runePaths.filter(rune => rune.perkPrimaryStyle === rowData.participants[0].stats.perkPrimaryStyle)[0].imageURL;
            runeSub = this.state.runePaths.filter(rune => rune.perkSubStyle === rowData.participants[0].stats.perkSubStyle)[0].imageURL;
        }

        return (
            <div className="p-grid nested-grid">
                <div className="p-col-6">
                    <div className="box box-stretched badge-item">                        
                        {champData &&
                            <div>
                                <div className="image-badge">{level}</div>
                                <img src={champData.imageURL} />
                                <span>{champData.champion}</span>
                            </div>
                        }
                        {!champData &&
                            <span>&nbsp;</span>
                        }
                    </div>
                    <div style={{ clear: 'both' }} />
                </div>
                <div className="p-col-6">
                    {isRunePathExists &&
                        <div className="p-grid">
                            <div className="p-col-6">
                            <div className="box">
                                {spell1Data &&
                                    <img src={spell1Data.imageURL} />
                                }
                                {!spell1Data &&
                                    <span>&nbsp;</span>
                                }
                            </div>
                            </div>
                            <div className="p-col-6">
                                <div className="box">
                                    <img src={runePrimary} />
                                </div>
                            </div>
                            <div className="p-col-6">
                                <div className="box">
                                {spell2Data &&
                                    <img src={spell2Data.imageURL} />
                                }
                                {!spell2Data &&
                                    <span>&nbsp;</span>
                                }
                                </div>
                            </div>
                            <div className="p-col-6">
                                <div className="box">
                                    <img src={runeSub} />
                                </div>
                            </div>
                        </div>
                    }
                    {!isRunePathExists &&
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div className="box">
                                    {spell1Data &&
                                        <img src={spell1Data.imageURL} />
                                    }
                                    {!spell1Data &&
                                        <span>&nbsp;</span>
                                    }
                                </div>
                            </div>
                            <div className="p-col-12">
                                <div className="box">
                                    {spell2Data &&
                                        <img src={spell2Data.imageURL} />
                                    }
                                    {!spell2Data &&
                                        <span>&nbsp;</span>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div style={{ clear: 'both' }} />
            </div>
        );
    }

    protected itemsTemplate(rowData: any, column: any) {
        const items: string[] = [];
        for (let i = 0; i < 6; i++) {
            if (rowData.participants[0].stats['item' + i] !== 0) {
                items.push(this.ddragonCDN + this.state.version + this.itemPath + rowData.participants[0].stats['item' + i] + ".png");
            }
        }
        return (
            <div className="p-grid nested-grid">
                <div className="p-col-9">
                    <div className="p-grid">                        
                        {
                            items.map((item: any, i) => {
                            return (
                                <div className="p-col-4" key={i}>
                                    <div style={{ margin: '0px 0px 0px 0px' }}>
                                        <img src={item ? item : '&nbsp;'} />
                                    </div>
                                </div>
                                    )
                                })
                        }
                    </div>
                </div>
                <div className="p-col-3">
                    <div className="box box-stretched">
                        <img src={this.ddragonCDN + this.state.version + this.itemPath + rowData.participants[0].stats.item6 + ".png"} />
                    </div>
                </div>
                <div style={{ clear: 'both' }} />
            </div>
        );
    }

    protected kdaTemplate(rowData: any, column: any) {
        const kill = rowData.participants[0].stats.kills;
        const death = rowData.participants[0].stats.deaths;
        const assist = rowData.participants[0].stats.assists;
        const src = rowData.participants[0].stats.kills + " | " + rowData.participants[0].stats.deaths + " | " + rowData.participants[0].stats.assists;
        const ratio = (Math.round(((kill + assist) / (Math.max(1, death)) * 100 )) / 100) + " Ratio";
        return <span><h3>{src}</h3><h3>{ratio}</h3></span>;
    }

    protected gameInfoTemplate(rowData: any, column:any) {
        const isWin = rowData.participants[0].stats.win ? "WIN" : "DEFEAT";
        const txtColor = (isWin === 'WIN' ? '#00ff00' : '#ff0000');
        const gameTime = Math.round(rowData.gameDuration / 60);
        const creationDate = new Date(rowData.gameCreation);
        const gameType = this.state.matchmaking.find(match => match.ID === rowData.queueId);
        
        return (
            <span>
                {gameType &&
                    <h3>{gameType.MAP + ": " + gameType.DESCRIPTION}</h3>
                }
                <h2><span style={{ color: txtColor }}>{isWin}</span></h2>
                <h3>{gameTime} Minutes | {creationDate.toISOString().substring(0, 10)}</h3>
            </span>
        );
    }

    protected farmTemplate(rowData: any, column: any) {
        const cs = rowData.participants[0].stats.totalMinionsKilled + rowData.participants[0].stats.neutralMinionsKilled;
        const gold = rowData.participants[0].stats.goldEarned;
        const goldRound = (gold / 1000).toFixed(2) + "k";
        return (
            <span><h3>{cs}<img src={this.ddragonCDN + this.iconVersion + this.farmPath + "minion.png"} style={{ margin: '0px 0px -15px 2px' }} /></h3><h3>{goldRound}<img src={this.ddragonCDN + this.iconVersion + this.farmPath + "gold.png"} style={{ margin: '0px 0px -15px 2px' }} /></h3></span>
        );
    }

    private getChampionImages(minData: any) {
        this.matchHistoryService.getChampionImages(this.state.version)
            .then((champData: any) => {
                const champs: any[] = [];
                minData.games.games.forEach((game: any) => {
                    const championObj: any = JSON.parse(champData);
                    Object.keys(championObj.data).forEach((key, index) => {
                        if (+championObj.data[key].key === game.participants[0].championId) {
                            champs.push({ "championId": +championObj.data[key].key, "champion": key, "imageURL": this.ddragonCDN + this.state.version + this.championPath + key + ".png" });
                        }
                    });
                    delete game.participants[0].timeline;
                });
                this.setState({ champNames: champs });
            });
    }

    private getSummonerSpells(minData: any) {
        this.matchHistoryService.getSummonerSpells(this.state.version)
            .then((spellData: any) => {
                const spells: any[] = [];
                minData.games.games.forEach((game: any) => {
                    const spellObj: any = JSON.parse(spellData);;
                    Object.keys(spellObj.data).forEach((key, index) => {
                        const spellURL: string = this.ddragonCDN + this.state.version + this.spellPath + key + ".png"
                        if (+spellObj.data[key].key === game.participants[0].spell1Id) {
                            spells.push({ "spell1Id": +spellObj.data[key].key, "imageURL": spellURL });
                        } else if (+spellObj.data[key].key === game.participants[0].spell2Id) {
                            spells.push({ "spell2Id": +spellObj.data[key].key, "imageURL": spellURL });
                        }
                    });
                });
                this.setState({ spellPaths: spells });
            });
    }

    private getSummonerRunes(minData: any) {
        this.matchHistoryService.getSummonerRunes(this.state.version)
            .then((runeData: any) => {
                const runes: any[] = [];
                const imgURL: string = this.ddragonCDN + this.runePath;
                minData.games.games.forEach((game: any) => {
                    const runeObj: any = JSON.parse(runeData);
                    const runePrimary = "perkPrimaryStyle";
                    const runeSub = "perkSubStyle";

                    runeObj.filter((rune: any) => {
                        return rune.id === game.participants[0].stats[runePrimary] || rune.id === game.participants[0].stats[runeSub];
                    }).map((rune: any) => {
                        if (rune.id === game.participants[0].stats[runePrimary]) {
                            runes.push({ [runePrimary]: rune.id, "imageURL": imgURL + rune.icon });
                        } else {
                            runes.push({ [runeSub]: rune.id, "imageURL": imgURL + rune.icon });
                        }
                        return;
                    });
                });
                this.setState({ runePaths: runes });
            });
    }

    private getMatchMakingTitles() {
        this.matchHistoryService.getMatchMakingTitles()
            .then((titleData: any) => {
                this.setState({ matchmaking: titleData });
            });
    }

    private handleChange(event: any) {
        this.setState({ ign: event.target.value });
    }

    private summonerSearch(event: any) {
        event.preventDefault();
        if (!this.state.ign) {
            this.setState({ ign: this.defaultSummoner });
        }
        this.loadSummonerGrid();
    }
}

export default MatchHistory;