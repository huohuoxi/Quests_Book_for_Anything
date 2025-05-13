import { quest, questData } from "./Define";
import { PopMgr } from "./PopMgr";
import { ProjectData } from "./ProjectData";
import { Utils } from "./Utils";

export class QuestList {

	private static echarts: echarts.ECharts;
	/**当前页面数据 桌面端才有的 */
	private static pageData: any;
	/**搜索任务列表 */
	private static questList: quest[];

	static updateIcon(res: quest){
		let questlist = this.pageData.series[0].data;
		for (let i = 0; i < questlist.length; i++) {
			if (questlist[i].name === res.quest_id && questlist[i].fake) {
				let foundQuest = questlist[i];
				let newSymbol = foundQuest.symbol.split(".")[0]+"_finish."+foundQuest.symbol.split(".")[1];
				foundQuest.symbol = newSymbol;
				break;
			}
		}
		for (let i = 0; i < questlist.length; i++) {
			if (questlist[i].name === res.name && (!questlist[i].fake)) {
				questlist[i].completed = true
				break;
			}
		}
		this.resetChart();
	}

	// 重置echarts
	static resetChart() {
		this.echarts?.clear();
		this.echarts?.resize();
		this.echarts?.setOption(this.pageData);
	}

	static getPageData(res: { data: questData; title: string }) {
		if (ProjectData.isPhone) {
			this.showSearchPopup(res.data.data);
		} else {
			Utils.typeText("#questTitle", res.title);
			this.pageData = Utils.deepClone(ProjectData.echartsConfig);
			this.pageData.series[0].data = res.data.data;
			this.pageData.series[0].links = res.data.links;
			this.initEcharts();
		}
	}


	//桌面端才有的
	static initEcharts() {
		if (!this.echarts) {
			this.echarts = echarts.init(
				document.getElementById("this_chart") as HTMLDivElement,
				"white",
				{ renderer: "canvas" }
			);
			this.echarts.on("click", (params: any) => {
				if (
					params.dataType === "node" &&
					params.data.hasOwnProperty("quest_id")
				) {
					PopMgr.showPopup(params.data);
				}
			});

			const chartElement = $("#mainPage")[0] as HTMLDivElement;
			const resizeObserver = new ResizeObserver(() => {
				this.onResize();
			});
			resizeObserver.observe(chartElement);
		}
		this.resetChart();
	}


	static onResize() {
		this.echarts?.resize();
	}

	static showSearchPopup(res?: quest[]) {
		$("#questSearchList").empty();
		if (res && res.length) {
			this.questList = res;
			this.showSearchList();
			$("#searchPopup").show();
		}
	}

	static clearSearchList() {
		$("#questSearchList").empty();
		$("#searchPopup").hide();
	}

	static toTop() {
		$("#questSearchList").animate({ scrollTop: 0 }, 500);
	}

	static showSearchList() {
		if (this.questList && this.questList.length) {
			this.questList.forEach(quest => {
				if (quest && quest.title !== undefined) {
					const item = $(`
						<div class="searchItem" data-id="${quest.quest_id}">
							<img class="searchImg" src="${quest.symbol.replace("image://", "")}" />
							<div class="searchTitle">${Utils.expMCcolor(quest.title)}</div>
							<div class="searchDesc">${Utils.expMCcolor(quest.data.substring(0, 50))}</div>
						</div>
					`);
					item.off("click");
					item.on("click", () => {
						PopMgr.showPopup(quest);
					});
					$("#questSearchList").append(item);
				}
			});
		}
	}
}