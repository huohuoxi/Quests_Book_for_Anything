import { lang, quest } from "./Define";
import { ProjectData } from "./ProjectData";
import { TipsMgr } from "./TipsMgr";
import { Utils } from "./Utils";

export class PopMgr {
	private static nowTitle: string = "";
	private static nowDesc: string = "";
	private static nowID: string = "";
	private static nowLogo: string = "";

	static onCopyDesc = () => {
		Utils.copyH5Str(Utils.removeHTMLTags(`${this.nowTitle}\n${this.nowDesc}`));
		TipsMgr.showTips(
			ProjectData.language == lang.zh ? "复制成功" : "Copy Success"
		);
	};

	static onCopyId = () => {
		Utils.copyH5Str(this.nowID);
		TipsMgr.showTips(
			ProjectData.language == lang.zh ? "复制成功" : "Copy Success"
		);
	};

	static onCopyLink = () => {
		Utils.copyH5Str(ProjectData.basicUrl + "?id=" + this.nowID);
		TipsMgr.showTips(
			ProjectData.language == lang.zh ? "复制成功" : "Copy Success"
		);
	};

	static showPopup(res: quest) {
		this.nowTitle = Utils.expMCcolor(res.title);
		this.nowDesc = this.processDesc(Utils.expMCcolor(res.data));
		this.nowID = res.quest_id;
		this.nowLogo = res.symbol.replace("image://", "");

		$("#quest_id").text(this.nowID);
		$("#popTitle").html(this.nowTitle);
		$("#popDesc").html(this.nowDesc);
		$("#quest_logo")[0].setAttribute("src", this.nowLogo);

		$("#mainPage").focus();
		removeEventListener("keydown", this.onKeyDown);
		addEventListener("keydown", this.onKeyDown);
		// 绑定点击消失
		$("#overlay").off("click");
		$("#overlay").on("click", this.hidePopup);

		$("#popup").off("click");
		$("#popup").on("click", this.onClickPop);

		// 绑定点击复制任务详情
		$("#copyBtn").off("click");
		$("#copyBtn").on("click", this.onCopyDesc);
		$("#copyBtn").css("display", "block");
		// 绑定点击复制任务ID
		$("#copyIdBtn").off("click");
		$("#copyIdBtn").on("click", this.onCopyId);
		$("#copyIdBtn").css("display", "block");

		// 绑定点击复制任务ID
		$("#copyLinkBtn").off("click");
		$("#copyLinkBtn").on("click", this.onCopyLink);
		$("#copyLinkBtn").css("display", "block");

		$("#copyBtn").text(
			ProjectData.language == lang.zh ? "复制任务详情" : "Copy Desc"
		);
		$("#copyIdBtn").text(
			ProjectData.language == lang.zh ? "复制任务ID" : "Copy ID"
		);
		$("#copyLinkBtn").text(
			ProjectData.language == lang.zh ? "复制任务链接" : "Copy Link"
		);

		$("btnClosePop").off("click");
		$("#btnClosePop").on("click", this.hidePopup);

		$("#screenShot").off("click");
		$("#screenShot").on("click", this.screenShot);

		$("#popup").css("scale", 0.8);
		$("#overlay").css("display", "flex");
		$("#popup").animate({ scale: 1 }, 200);
	}

	static showInfoPopup(): void {
		this.showPopup(
			ProjectData.language.includes("zh")
				? (ProjectData.infoQuest[1] as quest)
				: (ProjectData.infoQuest[0] as quest)
		);
		$("#copyBtn").css("display", "none");
		$("#copyIdBtn").css("display", "none");
		$("#copyLinkBtn").css("display", "none");
	}

	static processDesc(desc: string): string {
		let temp = desc.split(/\[\/?url\]/);
		let new_desc = "";
		for (let i = 0; i < temp.length; i++) {
			if (temp[i] !== undefined) {
				if (i % 2 === 1 && temp[i].trim().length > 0) {
					let temp_str = temp[i];
					new_desc += `<a href="${temp_str}" target="_blank">${temp_str}</a>`;
				} else {
					new_desc += temp[i];
				}
			}
		}

		temp = new_desc.split(/\[\/?note\]/);
		new_desc = "";
		for (let i = 0; i < temp.length; i++) {
			if (temp[i] !== undefined) {
				if (i % 2 === 1 && temp[i].trim().length > 0) {
					let temp_str = temp[i];
					new_desc += `<note style='color:#00AAAA'>${temp_str}</note>`;
				} else {
					new_desc += temp[i];
				}
			}
		}

		temp = new_desc.split(/\[\/?warn\]/);
		new_desc = "";
		for (let i = 0; i < temp.length; i++) {
			if (temp[i] !== undefined) {
				if (i % 2 === 1 && temp[i].trim().length > 0) {
					let temp_str = temp[i];
					new_desc += `<warn style='color:#AA0000'>${temp_str}</warn>`;
				} else {
					new_desc += temp[i];
				}
			}
		}
		return new_desc;
	}

	static hidePopup = () => {
		$("#overlay").css("display", "none");
	};

	static onClickPop = (args: Event) => {
		args.stopPropagation(); //停止冒泡
	};

	static screenShot() {
		// Utils.screenShot();
	}

	static onKeyDown = (event: KeyboardEvent) => {
		if (event.key == "Escape" || event.key == "e") {
			PopMgr.hidePopup();
		}
	};
}
