use actix_web::{get, web, App, HttpServer};
use mongodb::{options::ClientOptions, Client};

mod api;
mod models;
use api::project;

#[get("/")]
async fn test() -> String {
    "Welcome".to_string()
}

#[actix_web::main]
async fn main() -> Result<(), std::io::Error> {
    let client_options = ClientOptions::parse("mongodb://localhost:27017")
        .await
        .unwrap();
    let db = match Client::with_options(client_options) {
        Ok(x) => x.database("personal"),
        Err(_) => panic!("MongoDB 💀"),
    };

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone()))
            .service(test)
            .configure(project::config)
    })
    .bind(("127.0.0.1", 5050))?
    .run()
    .await
}
