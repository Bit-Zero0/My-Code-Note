const path = require('path');
const { exec } = require('child_process');
const quickAddApi = app.plugins.plugins.quickadd.api;

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="300px" height="300px" viewBox="-0.5 -0.5 1 1" content="&lt;mxGraphModel&gt;&lt;root&gt;&lt;mxCell id=&quot;0&quot;/&gt;&lt;mxCell id=&quot;1&quot; parent=&quot;0&quot;/&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;"></svg>`;

module.exports = {
    entry: async (QuickAdd, settings, params) => {

        const format = quickAddApi.date.now(settings["SVG命名格式"].replace("{{DATE:", "").replace("}}", ""));

        // 获取笔记的基本路径
        const file = app.workspace.getActiveFile();
        const folderPath = path.dirname(file.path);

        let filePath = `${format}.svg`;
        if (settings["SVG文件路径"] === "当前文件夹") {
            filePath = `${folderPath}/${format}.svg`;
        }        

        if (settings["SVG自动打开"]) {
            let choices = settings["SVG编辑器"].split("\n");
            if (!choices) {
                await app.vault.create(filePath, svgContent);
                // 用指定应用打开
                this.app.openWithDefaultApp(filePath);
            } else if (choices.length === 1) {
                await app.vault.create(filePath, svgContent);
                exec(`"${choices[0]}" "${(app.vault.adapter).getBasePath()}/${filePath}"`, (error, stdout, stderr) => {
                    new Notice(`File opened with ${choices[0]}`);
                });
            } else {
                choices.unshift("默认应用");
                const choice = await quickAddApi.suggester(choices.map(i => i.split("\\").at(-1).replace("\.exe", "")), choices, "图片打开的方式");
                if (!choice) return;
                await app.vault.create(filePath, svgContent);
                // 文件创建后打开
                if (choice === "默认应用") {
                    app.openWithDefaultApp(filePath);
                    return;
                }
                exec(`"${choice}" "${(app.vault.adapter).getBasePath()}/${filePath}"`, (error, stdout, stderr) => {
                    new Notice(`File opened with ${choice}`);
                });
            }
        }

        // 获取文档编辑器
        const editor = app.workspace.activeEditor.editor;
        editor.replaceRange(
            `![[${path.basename(filePath)}]]`,
            editor.getCursor());

        return;
    },
    settings: {
        name: "插入SVG文件",
        author: "熊猫别熬夜",
        options: {
            "SVG命名格式": {
                type: "format",
                defaultValue: "{{DATE:YYYY-MM-DD_HHmmss}}",
                description: "默认插入为时间戳的文件名格式：{{DATE:YYYY-MM-DD_HHmmss}}；",
            },
            "SVG文件路径": {
                type: "dropdown",
                defaultValue: "当前文件夹",
                options: [
                    "当前文件夹",
                    "仓库根目录",
                ],
                description: "若想指定文件夹可设为根目录，调整命名格式：{{DATE:[文件夹路径/子文件夹/文件名前缀_]YYYY-MM-DD_HHmmss}}",
            },
            "SVG自动打开": {
                type: "checkbox",
                defaultValue: true,
            },
            "SVG编辑器": {
                type: "format",
                defaultValue: "",
                description: "SVG编辑器，空值则系统默认编辑器，多个以换行分离，多个会出现弹窗来选择应用(包含默认应用)",
            },
        }
    }
};
