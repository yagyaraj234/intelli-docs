"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = void 0;
const index_1 = require("index");
function uploadFile(file, customFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = customFileName || `${Date.now()}_${file.originalname}`;
        const fileUpload = index_1.bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
        return new Promise((resolve, reject) => {
            blobStream.on("error", (error) => reject(error));
            blobStream.on("finish", () => __awaiter(this, void 0, void 0, function* () {
                // Make the file publicly readable
                yield fileUpload.makePublic();
                // Get the public URL
                const publicUrl = `https://storage.googleapis.com/${index_1.bucket.name}/${fileUpload.name}`;
                resolve({
                    fileName: fileUpload.name,
                    downloadUrl: publicUrl,
                });
            }));
            blobStream.end(file.buffer);
        });
    });
}
exports.uploadFile = uploadFile;
function deleteFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = index_1.bucket.file(fileName);
        try {
            yield file.delete();
        }
        catch (error) {
            console.error(`Error deleting file ${fileName}:`, error);
            throw error;
        }
    });
}
exports.deleteFile = deleteFile;
