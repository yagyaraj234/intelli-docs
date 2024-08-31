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
exports.uploadFile = void 0;
let db;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files } = req.files;
        const { name, size, mimetype } = file;
        const { id } = req.user;
        const fileRef = db.collection("files").doc();
        const fileData = {
            id: fileRef.id,
            name,
            size,
            mimetype,
            userId: id,
            createdAt: new Date(),
        };
        yield fileRef.set(fileData);
        return res.status(201).json({
            status: "success",
            message: "File uploaded successfully",
            data: fileData,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(ApiError("Internal server error", 500, error));
    }
});
exports.uploadFile = uploadFile;
