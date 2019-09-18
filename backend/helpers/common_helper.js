var ObjectId = require('mongodb').ObjectID;

var common_helper = {};

common_helper.loginCheck = async (data) => {
    try {
        var data = await Admin.findOne(data);
        if (data && data.length === 1) {
            return {
                status: 1,
                message: "Login Success",
                admin: data
            };
        } else {
            return { status: 2, message: "Login Failed" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while Login Check",
            error: err
        };
    }
}

common_helper.find = async (collection, data = {}, type = 2, start, length, filteredrecords) => {
    try {
        if (type == 1) {
            var data = await collection.findOne(data);
        }
        else {
            var data = await collection.find(data).skip(start).limit(length).sort({});
        }
        if (data || (data && data.length > 0)) {
            filteredrecords = filteredrecords.recordsTotal;
            return {
                status: 1,
                message: "data found",
                data: data,
                filteredrecords: data.length,
                recordsTotal: filteredrecords
            };
        } else {
            return { status: 2, message: "No data found" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while fetching data",
            error: err
        };
    }
}

common_helper.findWithFilter = async (collection, data = {}, start, limit, filteredrecords, sort = false) => {
    try {
        //var data = await collection.find(data).collation({ locale: "en" }).skip(start).limit(limit).sort(sort);
        var data = await collection.find(data).skip(start).limit(limit).sort(sort);
        if (data || (data && data.length > 0)) {
            filteredrecords = filteredrecords.recordsTotal;
            return {
                status: 1,
                message: "data found",
                data: data,
                filteredrecords: data.length,
                recordsTotal: filteredrecords
            };
        } else {
            return { status: 2, message: "No data found" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while fetching data",
            error: err
        };
    }
}

common_helper.findWithFilterss = async (collection, data = {}, type, start, limit, filteredrecords, sort = false, populate1, populate2) => {
    try {
        var data = await collection.find(data)
            .populate(populate1)
            .populate(populate2)
            .skip(start).limit(limit).sort(sort);
        if (data || (data && data.length > 0)) {
            filteredrecords = filteredrecords.recordsTotal;
            return {
                status: 1,
                message: "data found",
                data: data,
                filteredrecords: data.length,
                recordsTotal: filteredrecords
            };
        } else {
            return { status: 2, message: "No data found" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while fetching data",
            error: err
        };
    }
}

common_helper.count = async (collection, data = {}) => {
    try {
        var data = await collection.find(data).countDocuments();
        if (data || (data && data.length > 0)) {
            return {
                status: 1,
                message: "data found",
                data: data,
                recordsTotal: data
            };
        } else {
            return { status: 2, message: "No data found", recordsTotal: data };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while fetching data",
            error: err
        };
    }
}

common_helper.findOne = async (collection, data = {}, type = 1) => {
    // console.log(data);
    try {
        var data = await collection.findOne(data).lean();
        if (data || (data && data.length > 0)) {
            return {
                status: 1,
                message: "data found",
                data: data,
            };
        } else {
            return { status: 2, message: "No data found" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while fetching data",
            error: err
        };
    }
}

common_helper.insert = async (collection, data = {}) => {
    if (Object.keys(data).length > 0) {
        try {
            var insertObj = new collection(data);
            var data = await insertObj.save();
            if (data || data.length > 0) {
                return {
                    status: 1,
                    message: "Record inserted successfully.",
                    data: data
                };
            } else {
                return { status: 2, message: "No data inserted" };
            }
        } catch (err) {
            return {
                status: 0,
                message: "Error occured while inserting data",
                error: err
            };
        }
    }
    else {
        return {
            status: 0,
            message: "Enter data for insert",
            error: null
        };
    }
}

common_helper.insertMany = async (collection, data = {}) => {
    if ((data).length > 0) {
        try {
            var data = await collection.insertMany(data);
            if (data || data.length > 0) {
                return {
                    status: 1,
                    message: "Record inserted successfully.",
                    data: data
                };
            } else {
                return { status: 2, message: "No data inserted" };
            }
        } catch (err) {
            return {
                status: 0,
                message: "Error occured while inserting data",
                error: err
            };
        }
    }
    else {
        return {
            status: 0,
            message: "Enter data for insert",
            error: null
        };
    }
}

common_helper.update = async (collection, id, data) => {
    try {
        var data = await collection.findOneAndUpdate(id, data, { new: true });

        if (data) {
            return {
                status: 1,
                message: "Record updated successfully.",
                data: data
            };
        } else {
            return { status: 2, message: "No data updated" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while updating data",
            error: err
        };
    }
}

common_helper.delete = async (collection, id, data = {}) => {
    try {
        if (Object.keys(data).length > 0) {
            var data = await collection.findOneAndUpdate(id, data);
        }
        else {
            var data = await collection.remove(id);
        }
        if (data || data.length > 0) {
            return {
                status: 1,
                message: "Record deleted successfully.",
                data: data
            };
        } else {
            return { status: 2, message: "No data deleted" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while updating data",
            error: err
        };
    }
}

common_helper.multipledelete = async (collection, condition) => {
    try {
        var data = await collection.deleteMany({
            _id: { $in: condition }
        });
        if (data) {
            return {
                status: 1,
                message: "Record deleted successfully.",
                data: data
            };
        } else {
            return { status: 2, message: "No data deleted" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while deleting data",
            error: err
        };
    }
}

common_helper.updateMany = async (collection, condition) => {
    try {
        var data = await collection.updateMany(
            { _id: { $in: condition } },
            { $set: { "is_del": true } }
        );
        if (data) {
            return {
                status: 1,
                message: "Record deleted successfully.",
                data: data
            };
        } else {
            return { status: 2, message: "No data deleted" };
        }
    } catch (err) {
        return {
            status: 0,
            message: "Error occured while deleting data",
            error: err
        };
    }
}

module.exports = common_helper;
