const csv = require("../node_modules/fast-csv");
const fs = require("fs");
const os = require("os");

if (os.type() == "Windows_NT") {
    var outputPath = ".\\output\\";
    var baseLineDataPath = ".\\baseline\\";
    var readJSONPath = ".\\config.json";
} else {
    var outputPath = "./output/";
    var baseLineDataPath = "./baseline/";
    var readJSONPath = "./config.json";
}

var csvFilePath = outputPath + "unitTestsBaseline.csv";
var writeJSONPath = outputPath + "baseline.config.json";

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

var readCSVFlag = new Object();
var baseLineData = new Map();
var baseLineJSON = new Map();
var generalFileArray = new Array();
var realModelFileArray = new Array();

var csvStream = csv.createWriteStream({headers: true}).transform(function(row) {return {
    "Feature": row.Feature,
    "Case Id": row.CaseId,
    "Test Case": row.TestCase,
    "macOS-Polyfill-Fast-WASM": row.MPFWASM,
    "macOS-Polyfill-Sustained-WebGL": row.MPSWEBGL,
    "macOS-WebNN-Fast-BNNS": row.MWFBNNS,
    "macOS-WebNN-Fast-DNNL": row.MWFDNNL,
    "macOS-WebNN-Sustained-MPS": row.MWSMPS,
    "Android-Polyfill-Fast-WASM": row.APFWASM,
    "Android-Polyfill-Sustained-WebGL": row.APSWEBGL,
//    "Android-WebNN-Fast-NNAPI": row.AWFNNAPI,
    "Android-WebNN-Sustained-NNAPI": row.AWSNNAPI,
//    "Android-WebNN-Low-NNAPI": row.AWLNNAPI,
    "Win-Polyfill-Fast-WASM": row.WPFWASM,
    "Win-Polyfill-Sustained-WebGL": row.WPSWEBGL,
    "Win-WebNN-Fast-DNNL": row.WWFDNNL,
    "Win-WebNN-Sustained-DML": row.WWSDML,
    "Win-WebNN-Sustained-clDNN": row.WWSCLDNN,
    "Win-WebNN-Low-DML": row.WWLDML,
    "Linux-Polyfill-Fast-WASM": row.LPFWASM,
    "Linux-Polyfill-Sustained-WebGL": row.LPSWEBGL,
    "Linux-WebNN-Fast-DNNL": row.LWFDNNL,
    "Linux-WebNN-Sustained-clDNN": row.LWSCLDNN,
    "Linux-WebNN-Fast-IE-MKLDNN": row.LWFIEMKLDNN,
    "Linux-WebNN-Sustained-IE-clDNN": row.LWSIECLDNN,
    "Linux-WebNN-Low-IE-MYRIAD": row.LWLIEMYRIAD
}});

csvStream.pipe(fs.createWriteStream(csvFilePath));

var readJSON = JSON.parse(fs.readFileSync(readJSONPath));
baseLineJSON["Version"] = new Map();
baseLineJSON["Version"]["chromium"] = readJSON.Version.chromium;
baseLineJSON["Version"]["polyfill"] = readJSON.Version.polyfill;
var CPUType = readJSON.CPUType;

console.log("start to generate baseline...");

fs.readdir(baseLineDataPath, function(err, files) {
    if (err) {
        throw err;
    } else {
        for (let filename of files) {
            if (filename.split(".")[1] !== "csv") {
                let str = "This file is not csv file: " + filename;
                throw new Error(str);
            }

            readCSVFlag[filename] = false;
        }

        files.forEach(function(filename) {
            let prefer = null;
            let csvRow = null;

            if (filename.includes("macOS-Polyfill-Fast-WASM")) {
                prefer = "macOS-Polyfill-Fast-WASM";
                csvRow = "MPFWASM";
            } else if (filename.includes("macOS-Polyfill-Sustained-WebGL")) {
                prefer = "macOS-Polyfill-Sustained-WebGL";
                csvRow = "MPSWEBGL";
            } else if (filename.includes("macOS-WebNN-Fast-BNNS")) {
                prefer = "macOS-WebNN-Fast-BNNS";
                csvRow = "MWFBNNS";
            } else if (filename.includes("macOS-WebNN-Fast-DNNL")) {
                prefer = "macOS-WebNN-Fast-DNNL";
                csvRow = "MWFDNNL";
            } else if (filename.includes("macOS-WebNN-Sustained-MPS")) {
                prefer = "macOS-WebNN-Sustained-MPS";
                csvRow = "MWSMPS";
            } else if (filename.includes("Linux-Polyfill-Fast-WASM")) {
                prefer = "Linux-Polyfill-Fast-WASM";
                csvRow = "LPFWASM";
            } else if (filename.includes("Linux-Polyfill-Sustained-WebGL")) {
                prefer = "Linux-Polyfill-Sustained-WebGL";
                csvRow = "LPSWEBGL";
            } else if (filename.includes("Linux-WebNN-Fast-DNNL")) {
                prefer = "Linux-WebNN-Fast-DNNL";
                csvRow = "LWFDNNL";
            } else if (filename.includes("Linux-WebNN-Sustained-clDNN")) {
                prefer = "Linux-WebNN-Sustained-clDNN";
                csvRow = "LWSCLDNN";
            } else if (filename.includes("Linux-WebNN-Fast-IE-MKLDNN")) {
                prefer = "Linux-WebNN-Fast-IE-MKLDNN";
                csvRow = "LWFIEMKLDNN";
            } else if (filename.includes("Linux-WebNN-Sustained-IE-clDNN")) {
                prefer = "Linux-WebNN-Sustained-IE-clDNN";
                csvRow = "LWSIECLDNN";
            } else if (filename.includes("Linux-WebNN-Low-IE-MYRIAD")) {
                prefer = "Linux-WebNN-Low-IE-MYRIAD";
                csvRow = "LWLIEMYRIAD";
            } else if (filename.includes("Win-Polyfill-Fast-WASM")) {
                prefer = "Win-Polyfill-Fast-WASM";
                csvRow = "WPFWASM";
            } else if (filename.includes("Win-Polyfill-Sustained-WebGL")) {
                prefer = "Win-Polyfill-Sustained-WebGL";
                csvRow = "WPSWEBGL";
            } else if (filename.includes("Win-WebNN-Fast-DNNL")) {
                prefer = "Win-WebNN-Fast-DNNL";
                csvRow = "WWFDNNL";
            } else if (filename.includes("Win-WebNN-Sustained-DML")) {
                prefer = "Win-WebNN-Sustained-DML";
                csvRow = "WWSDML";
            } else if (filename.includes("Win-WebNN-Sustained-clDNN")) {
                prefer = "Win-WebNN-Sustained-clDNN";
                csvRow = "WWSCLDNN";
            } else if (filename.includes("Win-WebNN-Low-DML")) {
                prefer = "Win-WebNN-Low-DML";
                csvRow = "WWLDML";
            } else if (filename.includes("Android-Polyfill-Fast-WASM") && filename.includes(CPUType)) {
                prefer = "Android-Polyfill-Fast-WASM";
                csvRow = "APFWASM";
            } else if (filename.includes("Android-Polyfill-Sustained-WebGL") && filename.includes(CPUType)) {
                prefer = "Android-Polyfill-Sustained-WebGL";
                csvRow = "APSWEBGL";
            } else if (filename.includes("Android-WebNN-Fast-NNAPI") && filename.includes(CPUType)) {
                prefer = "Android-WebNN-Fast-NNAPI";
                csvRow = "AWFNNAPI";
            } else if (filename.includes("Android-WebNN-Sustained-NNAPI") && filename.includes(CPUType)) {
                prefer = "Android-WebNN-Sustained-NNAPI";
                csvRow = "AWSNNAPI";
            } else if (filename.includes("Android-WebNN-Low-NNAPI") && filename.includes(CPUType)) {
                prefer = "Android-WebNN-Low-NNAPI";
                csvRow = "AWLNNAPI";
            } else {
                let str = "This file is incorrect backend: " + filename;
                throw new Error(str);
            }

            let keyWord = null;
            if (filename.includes("general")) {
                keyWord = "general";
                generalFileArray.push(filename);
            } else if (filename.includes("realModel")) {
                keyWord = "realModel";
                realModelFileArray.push(filename);
            } else {
                let str = "This file is incorrect model: " + filename;
                throw new Error(str);
            }

            if (typeof baseLineJSON[prefer] === "undefined") {
                baseLineJSON[prefer] = new Map();
            }

            if (keyWord === "general") {
                baseLineJSON[prefer]["total"] = 0;
                baseLineJSON[prefer]["pass"] = 0;
                baseLineJSON[prefer]["fail"] = 0;
                baseLineJSON[prefer]["block"] = 0;
            } else if (keyWord === "realModel") {
                if (typeof baseLineJSON[prefer]["realModel"] === "undefined") {
                    baseLineJSON[prefer]["realModel"] = new Map();
                }

                baseLineJSON[prefer]["realModel"]["total"] = 0;
                baseLineJSON[prefer]["realModel"]["pass"] = 0;
                baseLineJSON[prefer]["realModel"]["fail"] = 0;
                baseLineJSON[prefer]["realModel"]["block"] = 0;
            }

            baseLineData.set(filename, new Map());

            csv.fromPath(baseLineDataPath + filename, {headers: true})
            .on("data", function(data) {
                let keyName = data["Feature"] + "-" + data["Case Id"] + "-" + data["Test Case"];
                if (baseLineData.get(filename).has(keyName)) {
                    let str = "The same test case: " + filename + "-" + keyName;
                    throw new Error(str);
                } else {
                    baseLineData.get(filename).set(keyName, new Map());
                    baseLineData.get(filename).get(keyName).set("Feature", data["Feature"]);
                    baseLineData.get(filename).get(keyName).set("Case Id", data["Case Id"]);
                    baseLineData.get(filename).get(keyName).set("Test Case", data["Test Case"]);
                    baseLineData.get(filename).get(keyName).set("csvRow", csvRow);

                    if (data["Pass"] == "1") {
                        baseLineData.get(filename).get(keyName).set("result", "Pass");
                        if (keyWord === "general") {
                            baseLineJSON[prefer]["pass"] = baseLineJSON[prefer]["pass"] + 1;
                        } else if (keyWord === "realModel") {
                            baseLineJSON[prefer]["realModel"]["pass"] = baseLineJSON[prefer]["realModel"]["pass"] + 1;
                        }
                    } else if (data["Fail"] == "1") {
                        baseLineData.get(filename).get(keyName).set("result", "Fail");
                        if (keyWord === "general") {
                            baseLineJSON[prefer]["fail"] = baseLineJSON[prefer]["fail"] + 1;
                        } else if (keyWord === "realModel") {
                            baseLineJSON[prefer]["realModel"]["fail"] = baseLineJSON[prefer]["realModel"]["fail"] + 1;
                        }
                    } else if (data["N/A"] == "1") {
                        baseLineData.get(filename).get(keyName).set("result", "N/A");
                        if (keyWord === "general") {
                            baseLineJSON[prefer]["block"] = baseLineJSON[prefer]["block"] + 1;
                        } else if (keyWord === "realModel") {
                            baseLineJSON[prefer]["realModel"]["block"] = baseLineJSON[prefer]["realModel"]["block"] + 1;
                        }
                    }

                    if (keyWord === "general") {
                        baseLineJSON[prefer]["total"] = baseLineJSON[prefer]["total"] + 1;
                    } else if (keyWord === "realModel") {
                        baseLineJSON[prefer]["realModel"]["total"] = baseLineJSON[prefer]["realModel"]["total"] + 1;
                    }
                }
            })
            .on("end", function() {
                readCSVFlag[filename] = true;
                console.log("read csv file: " + filename);

                if (!Object.values(readCSVFlag).includes(false)) {
                    let filenameFlag = null;

                    console.log("check baseline data of general test cases...");
                    if (generalFileArray.length > 1) {
                        filenameFlag = generalFileArray[0];

                        for (let testCase of baseLineData.get(filenameFlag).keys()) {
                            for (let filename of generalFileArray) {
                                if (!baseLineData.get(filename).has(testCase)) {
                                    let str = "Between '" + filename + "'\nand '" + filenameFlag + "',\n" + "This test case is not the same: " + testCase;
                                    throw new Error(str);
                                }
                            }
                        }
                    } else {
                        console.log("there are " + generalFileArray.length + " general test cases, that no need to check!");
                    }

                    console.log("check baseline data of real model test cases...");
                    if (realModelFileArray.length > 1) {
                        filenameFlag = realModelFileArray[0];

                        for (let testCase of baseLineData.get(filenameFlag).keys()) {
                            for (let filename of realModelFileArray) {
                                if (!baseLineData.get(filename).has(testCase)) {
                                    let str = "Between '" + filename + "'\nand '" + filenameFlag + "',\n" + "This test case is not the same: " + testCase;
                                    throw new Error(str);
                                }
                            }
                        }
                    } else {
                        console.log("there are " + realModelFileArray.length + " real model test cases, that no need to check!");
                    }

                    console.log("generate baseline data...");
                    if (generalFileArray.length !== 0) {
                        filenameFlag = generalFileArray[0];

                        for (let testCase of baseLineData.get(filenameFlag).keys()) {
                            let DataFormat = new Object();
                            DataFormat["Feature"] = baseLineData.get(filenameFlag).get(testCase).get("Feature");
                            DataFormat["CaseId"] = baseLineData.get(filenameFlag).get(testCase).get("Case Id");
                            DataFormat["TestCase"] = baseLineData.get(filenameFlag).get(testCase).get("Test Case");

                            for (let filename of generalFileArray) {
                                DataFormat[baseLineData.get(filename).get(testCase).get("csvRow")] = baseLineData.get(filename).get(testCase).get("result");
                            }

                            csvStream.write(DataFormat);
                        }
                    }

                    if (realModelFileArray.length !== 0) {
                        filenameFlag = realModelFileArray[0];

                        for (let testCase of baseLineData.get(filenameFlag).keys()) {
                            let DataFormat = new Object();
                            DataFormat["Feature"] = baseLineData.get(filenameFlag).get(testCase).get("Feature");
                            DataFormat["CaseId"] = baseLineData.get(filenameFlag).get(testCase).get("Case Id");
                            DataFormat["TestCase"] = baseLineData.get(filenameFlag).get(testCase).get("Test Case");

                            for (let filename of realModelFileArray) {
                                DataFormat[baseLineData.get(filename).get(testCase).get("csvRow")] = baseLineData.get(filename).get(testCase).get("result");
                            }

                            csvStream.write(DataFormat);
                        }
                    }

                    console.log("generate baseline json...");
                    fs.writeFileSync(writeJSONPath, JSON.stringify(baseLineJSON, null, 4));

                    console.log("complete!");
                }
            });
        });
    }
});
