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

var csvCount = 0;
var baseLineData = new Map();
var baseLineJSON = new Map();

var csvStream = csv.createWriteStream({headers: true}).transform(function(row) {return {
    "Feature": row.Feature,
    "Case Id": row.CaseId,
    "Test Case": row.TestCase,
    "Mac-MPS": row.MMPS,
    "Mac-BNNS": row.MBNNS,
    "Mac-WASM": row.MWASM,
    "Mac-WebGL": row.MWebGL,
    "Android-NNAPI": row.ANNAPI,
    "Android-WASM": row.AWASM,
    "Android-WebGL": row.AWebGL,
    "Windows-clDNN": row.WclDNN,
    "Windows-MKLDNN": row.WMKLDNN,
    "Windows-WASM": row.WWASM,
    "Windows-WebGL": row.WWebGL,
    "Linux-clDNN": row.LclDNN,
    "Linux-IE-MKLDNN": row.LIEMKLDNN,
    "Linux-MKLDNN": row.LMKLDNN,
    "Linux-WASM": row.LWASM,
    "Linux-WebGL": row.LWebGL
}});

csvStream.pipe(fs.createWriteStream(csvFilePath));

var readJSON = JSON.parse(fs.readFileSync(readJSONPath));
baseLineJSON["Version"] = new Map();
baseLineJSON["Version"]["chromium"] = readJSON.Version.chromium;
baseLineJSON["Version"]["polyfill"] = readJSON.Version.polyfill;

fs.readdir(baseLineDataPath, function(err, files) {
    if (err) {
        throw err;
    } else {
        files.forEach(function(filename) {
            if (filename !== "config.json") {
                let filenameArray = filename.split("-");
                let backend = null;
                let csvRow = null;

                switch(filenameArray[1]) {
                    case "mac":
                        switch(filenameArray[2]) {
                            case "mps":
                                backend = "Mac-MPS";
                                csvRow = "MMPS";
                                break;
                            case "bnns":
                                backend = "Mac-BNNS";
                                csvRow = "MBNNS";
                                break;
                            case "wasm":
                                backend = "Mac-WASM";
                                csvRow = "MWASM";
                                break;
                            case "webgl":
                                backend = "Mac-WebGL";
                                csvRow = "MWebGL";
                                break;
                        };
                        break;
                    case "android":
                        switch(filenameArray[3]) {
                            case "nnapi":
                                backend = "Android-NNAPI";
                                csvRow = "ANNAPI";
                                break;
                            case "wasm":
                                backend = "Android-WASM";
                                csvRow = "AWASM";
                                break;
                            case "webgl":
                                backend = "Android-WebGL";
                                csvRow = "AWebGL";
                                break;
                        };
                        break;
                    case "windows":
                        switch(filenameArray[2]) {
                            case "cldnn":
                                backend = "Windows-clDNN";
                                csvRow = "WclDNN";
                                break;
                            case "mkldnn":
                                backend = "Windows-MKLDNN";
                                csvRow = "WMKLDNN";
                                break;
                            case "wasm":
                                backend = "Windows-WASM";
                                csvRow = "WWASM";
                                break;
                            case "webgl":
                                backend = "Windows-WebGL";
                                csvRow = "WWebGL";
                                break;
                        };
                        break;
                    case "linux":
                        switch(filenameArray[2]) {
                            case "cldnn":
                                backend = "Linux-clDNN";
                                csvRow = "LclDNN";
                                break;
                            case "mkldnn":
                                backend = "Linux-MKLDNN";
                                csvRow = "LMKLDNN";
                                break;
                            case "wasm":
                                backend = "Linux-WASM";
                                csvRow = "LWASM";
                                break;
                            case "webgl":
                                backend = "Linux-WebGL";
                                csvRow = "LWebGL";
                                break;
                            case "ie":
                                switch(filenameArray[3]) {
                                    case "mkldnn":
                                        backend = "Linux-IE-MKLDNN";
                                        csvRow = "LIEMKLDNN";
                                        break;
                                };
                                break;
                        };
                        break;
                }

                baseLineJSON[backend] = new Map();
                baseLineJSON[backend]["total"] = 0;
                baseLineJSON[backend]["pass"] = 0;
                baseLineJSON[backend]["fail"] = 0;
                baseLineJSON[backend]["block"] = 0;

                csv.fromPath(baseLineDataPath + filename).on("data", function(data){
                    if (data[0] !== "Feature") {
                        if (typeof baseLineData.get(data[0] + "-" + data[1]) == "undefined") {
                            baseLineData.set(data[0] + "-" + data[1], new Array());
                            baseLineData.get(data[0] + "-" + data[1])["Feature"] = data[0];
                            baseLineData.get(data[0] + "-" + data[1])["CaseId"] = data[1];
                            baseLineData.get(data[0] + "-" + data[1])["TestCase"] = data[2];
                        }

                        if (data[3] == "1") {
                            baseLineData.get(data[0] + "-" + data[1])[csvRow] = "Pass";
                            baseLineJSON[backend]["pass"] = baseLineJSON[backend]["pass"] + 1;
                        } else if (data[4] == "1") {
                            baseLineData.get(data[0] + "-" + data[1])[csvRow] = "Fail";
                            baseLineJSON[backend]["fail"] = baseLineJSON[backend]["fail"] + 1;
                        } else if (data[5] == "1") {
                            baseLineData.get(data[0] + "-" + data[1])[csvRow] = "N/A";
                            baseLineJSON[backend]["block"] = baseLineJSON[backend]["block"] + 1;
                        }

                        baseLineJSON[backend]["total"] = baseLineJSON[backend]["total"] + 1;
                    }
                }).on("end", function() {
                    csvCount = csvCount + 1;

                    if (csvCount == files.length - 1) {
                        for (let value of baseLineData.values()) {
                            csvStream.write(value);
                        }

                        fs.writeFileSync(writeJSONPath, JSON.stringify(baseLineJSON, null, 4));
                    }
                });
            }
        });
    }
});
