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

var csvStream = csv.createWriteStream({headers: true}).transform(function(row) {return {
    "Feature": row.Feature,
    "Case Id": row.CaseId,
    "Test Case": row.TestCase,
    "macOS-Polyfill-Fast-WASM": row.MPFWASM,
    "macOS-Polyfill-Sustained-WebGL": row.MPSWEBGL,
    "macOS-WebNN-Fast-BNNS": row.MWFBNNS,
    "macOS-WebNN-Fast-MKLDNN": row.MWFMKLDNN,
    "macOS-WebNN-Sustained-MPS": row.MWSMPS,
    "Android-Polyfill-Fast-WASM": row.APFWASM,
    "Android-Polyfill-Sustained-WebGL": row.APSWEBGL,
//    "Android-WebNN-Fast-NNAPI": row.AWFNNAPI,
    "Android-WebNN-Sustained-NNAPI": row.AWSNNAPI,
//    "Android-WebNN-Low-NNAPI": row.AWLNNAPI,
    "Win-Polyfill-Fast-WASM": row.WPFWASM,
    "Win-Polyfill-Sustained-WebGL": row.WPSWEBGL,
    "Win-WebNN-Fast-MKLDNN": row.WWFMKLDNN,
    "Win-WebNN-Sustained-DML": row.WWSDML,
    "Win-WebNN-Sustained-clDNN": row.WWSCLDNN,
    "Win-WebNN-Low-DML": row.WWLDML,
    "Linux-Polyfill-Fast-WASM": row.LPFWASM,
    "Linux-Polyfill-Sustained-WebGL": row.LPSWEBGL,
    "Linux-WebNN-Fast-MKLDNN": row.LWFMKLDNN,
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
            } else if (filename.includes("macOS-WebNN-Fast-MKLDNN")) {
                prefer = "macOS-WebNN-Fast-MKLDNN";
                csvRow = "MWFMKLDNN";
            } else if (filename.includes("macOS-WebNN-Sustained-MPS")) {
                prefer = "macOS-WebNN-Sustained-MPS";
                csvRow = "MWSMPS";
            } else if (filename.includes("Linux-Polyfill-Fast-WASM")) {
                prefer = "Linux-Polyfill-Fast-WASM";
                csvRow = "LPFWASM";
            } else if (filename.includes("Linux-Polyfill-Sustained-WebGL")) {
                prefer = "Linux-Polyfill-Sustained-WebGL";
                csvRow = "LPSWEBGL";
            } else if (filename.includes("Linux-WebNN-Fast-MKLDNN")) {
                prefer = "Linux-WebNN-Fast-MKLDNN";
                csvRow = "LWFMKLDNN";
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
            } else if (filename.includes("Win-WebNN-Fast-MKLDNN")) {
                prefer = "Win-WebNN-Fast-MKLDNN";
                csvRow = "WWFMKLDNN";
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
                let str = "This file is not test report file: " + filename;
                throw new Error(str);
            }

            baseLineJSON[prefer] = new Map();
            baseLineJSON[prefer]["total"] = 0;
            baseLineJSON[prefer]["pass"] = 0;
            baseLineJSON[prefer]["fail"] = 0;
            baseLineJSON[prefer]["block"] = 0;

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
                        baseLineJSON[prefer]["pass"] = baseLineJSON[prefer]["pass"] + 1;
                    } else if (data["Fail"] == "1") {
                        baseLineData.get(filename).get(keyName).set("result", "Fail");
                        baseLineJSON[prefer]["fail"] = baseLineJSON[prefer]["fail"] + 1;
                    } else if (data["N/A"] == "1") {
                        baseLineData.get(filename).get(keyName).set("result", "N/A");
                        baseLineJSON[prefer]["block"] = baseLineJSON[prefer]["block"] + 1;
                    }

                    baseLineJSON[prefer]["total"] = baseLineJSON[prefer]["total"] + 1;
                }
            })
            .on("end", function() {
                readCSVFlag[filename] = true;
                console.log("read csv file: " + filename);

                if (!Object.values(readCSVFlag).includes(false)) {
                    let filenameFlag = null;
                    for (let filename of baseLineData.keys()) {
                        if (filenameFlag == null) {
                            filenameFlag = filename;
                        }
                    }

                    console.log("check baseline data...");
                    for (let testCase of baseLineData.get(filenameFlag).keys()) {
                        for (let filename of baseLineData.keys()) {
                            if (!baseLineData.get(filename).has(testCase)) {
                                let str = "Between '" + filename + "'\nand '" + filenameFlag + "',\n" + "This test case is not the same: " + testCase;
                                throw new Error(str);
                            }
                        }
                    }

                    console.log("generate baseline data...");
                    for (let testCase of baseLineData.get(filenameFlag).keys()) {
                        let DataFormat = new Object();
                        DataFormat["Feature"] = baseLineData.get(filenameFlag).get(testCase).get("Feature");
                        DataFormat["CaseId"] = baseLineData.get(filenameFlag).get(testCase).get("Case Id");
                        DataFormat["TestCase"] = baseLineData.get(filenameFlag).get(testCase).get("Test Case");

                        for (let filename of baseLineData.keys()) {
                            DataFormat[baseLineData.get(filename).get(testCase).get("csvRow")] = baseLineData.get(filename).get(testCase).get("result");
                        }

                        csvStream.write(DataFormat);
                    }

                    console.log("generate baseline json...");
                    fs.writeFileSync(writeJSONPath, JSON.stringify(baseLineJSON, null, 4));

                    console.log("complete!");
                }
            });
        });
    }
});
