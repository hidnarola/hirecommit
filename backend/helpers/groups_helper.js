var ObjectId = require('mongodb').ObjectID;

var groups_helper = {};
groups_helper.get_all_groups = async (collection, id, search, start, length, recordsTotal, sort) => {
  try {
    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
    var aggregate = [
      {
        $match: {
          "is_del": false,
          "emp_id": new ObjectId(id)
        }
      }
    ]
    if (search && search.value != '') {
      aggregate.push({
        "$match":
        {
          $or: [
            { "name": RE },
            { "high_unopened": RE },
            { "high_notreplied": RE },
            { "medium_unopened": RE },
            { "medium_notreplied": RE },
            { "low_unopened": RE },
            { "low_notreplied": RE }
          ]
        }
      });
    }
    if (sort) {
      aggregate.push({
        "$sort": sort
      });
    }

    if (start) {
      aggregate.push({
        "$skip": start
      });
    }
    if (length) {
      aggregate.push({
        "$limit": length
      });
    }
    let groups = await collection.aggregate(aggregate);
    if (groups) {
      return { "status": 1, "message": "group details found", "groups": groups, "recordsTotal": recordsTotal };
    } else {
      return { "status": 2, "message": "groups not found" };
    }
  } catch (err) {
    return { "status": 0, "message": "Error occured while finding music", "error": err }
  }
};

module.exports = groups_helper;
