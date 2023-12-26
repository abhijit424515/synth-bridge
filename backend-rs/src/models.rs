use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    #[serde(rename = "_id", default = "ObjectId::new")]
    pub _id: ObjectId,
    pub name: String,
}
