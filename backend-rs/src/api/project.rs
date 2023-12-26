use crate::models::Project;
use actix_web::{delete, get, patch, post, put, web, HttpResponse, Responder};
use bson::Document;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};
use serde::Deserialize;
use serde_json::Value;

#[derive(Deserialize)]
struct GetOrDelete {
    id: Option<String>,
}

#[get("/")]
async fn get(db: web::Data<Database>, qp: web::Query<GetOrDelete>) -> impl Responder {
    match &qp.id {
        Some(x) => {
            let id = ObjectId::parse_str(x).unwrap();
            let project = db
                .collection::<Project>("project")
                .find_one(doc! { "_id": id }, None)
                .await
                .unwrap();
            HttpResponse::Ok().json(project)
        }
        None => {
            let projects: Vec<Project> = db
                .collection::<Project>("project")
                .find(None, None)
                .await
                .unwrap()
                .try_collect()
                .await
                .unwrap();
            HttpResponse::Ok().json(projects)
        }
    }
}

#[post("/")]
async fn post(db: web::Data<Database>, body: web::Json<Project>) -> impl Responder {
    let data = db
        .collection::<Project>("project")
        .insert_one(body.into_inner(), None)
        .await
        .unwrap();
    HttpResponse::Ok().json(data)
}

#[put("/")]
async fn put(db: web::Data<Database>, body: web::Json<Value>) -> impl Responder {
    let id = ObjectId::parse_str(body["_id"].as_str().unwrap()).unwrap();
    let set_doc: Project = serde_json::from_value(body.clone()).unwrap();

    let data = db
        .collection::<Project>("project")
        .replace_one(doc! { "_id": id }, set_doc, None)
        .await
        .unwrap();
    HttpResponse::Ok().json(data)
}

#[patch("/")]
async fn patch(db: web::Data<Database>, body: web::Json<Value>) -> impl Responder {
    let mut z = body.clone();
    let z = z.as_object_mut().unwrap();
    let id = ObjectId::parse_str(z.remove("_id").unwrap().as_str().unwrap()).unwrap();
    let set_doc = bson::to_bson(z).unwrap();

    let data = db
        .collection::<Project>("project")
        .update_one(doc! { "_id": id }, doc! { "$set": set_doc }, None)
        .await
        .unwrap();
    HttpResponse::Ok().json(data)
}

#[delete("/")]
async fn delete(db: web::Data<Database>, qp: web::Query<GetOrDelete>) -> impl Responder {
    match &qp.id {
        Some(x) => {
            let id = ObjectId::parse_str(x).unwrap();
            let project = db
                .collection::<Project>("project")
                .delete_one(doc! { "_id": id }, None)
                .await
                .unwrap();
            HttpResponse::Ok().json(project)
        }
        None => {
            let projects = db
                .collection::<Project>("project")
                .delete_many(Document::new(), None)
                .await
                .unwrap();
            HttpResponse::Ok().json(projects)
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/project")
            .service(get)
            .service(post)
            .service(put)
            .service(patch)
            .service(delete),
    );
}
