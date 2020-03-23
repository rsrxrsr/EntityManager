webpackJsonp([0],{

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServicioFirebase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_fire_firestore__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_fire_storage__ = __webpack_require__(247);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



//import { AngularFireAuthModule } from "@angular/fire/auth";
//import { AngularFirestore } from 'angularfire2/firestore';
var ServicioFirebase = /** @class */ (function () {
    function ServicioFirebase(afs, storage
        //public auth: AngularFireAuthModule
    ) {
        this.afs = afs;
        this.storage = storage;
        //-------------------------------------------------------------------------------------------------------------------
        this.modelo = [{ usuario: { roles: "" } }];
        this.model = [];
        this.roles = "Administrador";
        this.that = this;
    }
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Método genérico para subir elementos a firebase.
    // params: objeto: objeto javascript, coleccion: nombre de la colección
    ServicioFirebase.prototype.agregarDocumento = function (coleccion, objeto) {
        var _this = this;
        delete objeto.id;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).add(objeto)
                .then(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    ServicioFirebase.prototype.upsertDocument = function (coleccion, id, doc) {
        var _this = this;
        console.log("Upsert", coleccion, id, doc);
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).doc(id).set(doc)
                .then(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    ServicioFirebase.prototype.getId = function () {
        return this.afs.createId();
    };
    ServicioFirebase.prototype.agregarSubDocumento = function (id, coleccion, doc) {
        var _this = this;
        var objeto = Object.assign({}, doc);
        delete objeto.id;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).doc(id).collection(coleccion).add(objeto)
                .then(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Método genérico para editar un documento en firebase, es necesario que el objeto tenga el id inyectado o pasado como parámetro
    // params: objeto: objeto javascript, colección: nombre de la colección.
    ServicioFirebase.prototype.editarDocumento = function (coleccion, id, doc) {
        var _this = this;
        //if(id != null)
        //objeto.id = id;
        var objeto = Object.assign({}, doc);
        delete objeto.id;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).doc(id).update(objeto)
                .then(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Método genérico para eliminar un documento en firebase
    // params: id del documento, colección
    ServicioFirebase.prototype.eliminarDocumento = function (coleccion, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).doc(id).delete()
                .then(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Método genérico para obtener una colección
    // params: colección: nombre de la colección
    // para leer un elemento obtenido com un objeto normal javascript: respuesta[i].payload.doc.data()
    //item['municipios']=[{id:1,cvMunicipio:"CV",municipio:"mun"}];
    ServicioFirebase.prototype.consultarColeccion = function (coleccion) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).snapshotChanges().subscribe(function (querySnapshot) {
                var snapshot = [];
                querySnapshot.forEach(function (doc) {
                    var item = doc.payload.doc.data();
                    item['id'] = doc.payload.doc.id;
                    snapshot.push(item);
                });
                console.log("Consulta: ", coleccion, snapshot);
                _this.modelo[coleccion] = snapshot;
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.getColeccion = function (coleccion) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).snapshotChanges().subscribe(function (querySnapshot) {
                var snapshot = {};
                querySnapshot.forEach(function (doc) {
                    snapshot[doc.payload.doc.id] = doc.payload.doc.data();
                });
                console.log("Consulta: ", coleccion, snapshot);
                _this.model[coleccion] = snapshot;
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.findOrderCollection = function (coleccion, campo, operador, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion, function (ref) { return ref.where(campo, operador, value).orderBy('fhAlta'); })
                .snapshotChanges().subscribe(function (querySnapshot) {
                var snapshot = [];
                var ids = [];
                querySnapshot.forEach(function (doc) {
                    var item = doc.payload.doc.data();
                    item['id'] = doc.payload.doc.id;
                    snapshot.push(item);
                    ids["id"] = doc.payload.doc.id;
                });
                console.log("Consulta: ", coleccion, campo, value, snapshot);
                _this.modelo[coleccion] = snapshot;
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.findOrderCaso = function (coleccion) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion, function (ref) { return ref.where("estatus", "==", "Activo").orderBy('dateCreation'); })
                .snapshotChanges().subscribe(function (querySnapshot) {
                var snapshot = [];
                var ids = [];
                querySnapshot.forEach(function (doc) {
                    var item = doc.payload.doc.data();
                    item['id'] = doc.payload.doc.id;
                    snapshot.push(item);
                    ids["id"] = doc.payload.doc.id;
                });
                console.log("Consulta: ", coleccion, snapshot);
                _this.modelo[coleccion] = snapshot;
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.getOrderCollection = function (coleccion) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion, function (ref) { return ref.orderBy('fhAlta'); })
                .snapshotChanges().subscribe(function (querySnapshot) {
                var snapshot = [];
                querySnapshot.forEach(function (doc) {
                    var item = doc.payload.doc.data();
                    item['id'] = doc.payload.doc.id;
                    snapshot.push(item);
                });
                console.log("Consulta: ", coleccion, snapshot);
                _this.modelo[coleccion] = snapshot;
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.docById = function (doc) {
        var _this = this;
        console.log("doc", doc);
        return new Promise(function (resolve, reject) {
            _this.afs.doc(doc).ref.get()
                .then(function (querySnapshot) {
                var snapshot = querySnapshot.data();
                snapshot['id'] = querySnapshot.id;
                //console.log("docById", querySnapshot.ref.parent , "par", querySnapshot.ref.parent.parent, "path", querySnapshot.ref.path); 
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.findById = function (coleccion, id) {
        var _this = this;
        console.log("Coll", coleccion, "cfb", id);
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).doc(id).ref.get()
                .then(function (querySnapshot) {
                var snapshot = querySnapshot.data();
                snapshot['id'] = id;
                console.log("snapshot", snapshot);
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.findColeccion = function (coleccion, campo, operador, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion, function (ref) { return ref.where(campo, operador, value); })
                .snapshotChanges().subscribe(function (querySnapshot) {
                var snapshot = [];
                querySnapshot.forEach(function (doc) {
                    var item = doc.payload.doc.data();
                    item['id'] = doc.payload.doc.id;
                    snapshot.push(item);
                });
                console.log("Consulta: ", coleccion, snapshot);
                _this.modelo[coleccion] = snapshot;
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.consultarColecciones = function (coleccion) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collectionGroup(coleccion).snapshotChanges().subscribe(function (querySnapshot) {
                var snapshot = [];
                querySnapshot.forEach(function (doc) {
                    var item = doc.payload.doc.data();
                    item['id'] = doc.payload.doc.id;
                    snapshot.push(item);
                });
                console.log("Current snapshot 0: ", snapshot, snapshot.length);
                _this.modelo[coleccion] = snapshot;
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.findChild = function (coleccion, subcoleccion, document) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).doc(document)
                .collection(subcoleccion).snapshotChanges().subscribe(function (querySnapshot) {
                var snapshot = [];
                querySnapshot.forEach(function (doc) {
                    var item = doc.payload.doc.data();
                    item['id'] = doc.payload.doc.id;
                    snapshot.push(item);
                });
                console.log("Current SUB snapshot 0: ", snapshot[0], snapshot.length);
                resolve(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.watchColeccion = function (coleccion) {
        var db = this.afs.firestore;
        return new Promise(function (resolve, reject) {
            db.collection(coleccion)
                .onSnapshot(function (querySnapshot) {
                var snapshot = [];
                querySnapshot.forEach(function (doc) {
                    var item = doc.data();
                    item.id = doc.id;
                    snapshot.push(item);
                });
                console.log("Current snapshot 0: ", snapshot[0], snapshot.length);
                console.log("Current snapshot 1: ", snapshot[1]);
                resolve(snapshot);
                this.saveTextAsFile(snapshot);
            });
        });
    };
    ServicioFirebase.prototype.getInstancias = function (coleccion, region) {
        var _this = this;
        console.log('Instancias');
        var f = new Date();
        var fecha = f.getFullYear() + "/" + (f.getMonth() + 1) + "/" + f.getDate();
        this.modelo["encuestaInstancia"] = [];
        return new Promise(function (resolve, reject) {
            _this.consultarColeccion(coleccion).then(function (snap1) {
                console.log("snap1", snap1);
                snap1.forEach(function (element1, index1) {
                    var ref1 = coleccion + "/" + element1.id + "/instancias";
                    //, ref => ref.where("fhFin", ">", fecha)        
                    _this.afs.collection(ref1)
                        .snapshotChanges().subscribe(function (snap2) {
                        console.log("snap2", snap2);
                        var max;
                        snap2.forEach(function (element2) {
                            var doc = element2.payload.doc.data();
                            doc["id"] = element2.payload.doc.id;
                            console.log("MaxInstancia", region, doc["idRegion"], doc["fhFin"]);
                            if (region.includes(doc["idRegion"])) {
                                if (!max || max.fhFin < doc["fhFin"]) {
                                    max = doc;
                                }
                            }
                        });
                        if (max) {
                            console.log("max", max);
                            element1.instancia = max;
                            _this.modelo["encuestaInstancia"].push(element1);
                        }
                    });
                });
                console.log("resolve", snap1);
                resolve(snap1);
            });
        });
    };
    ServicioFirebase.prototype.uploadDocumento = function (coleccion, objeto) {
        var _this = this;
        delete objeto.id;
        return new Promise(function (resolve, reject) {
            _this.afs.collection(coleccion).add(objeto)
                .then(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    // File Upload
    ServicioFirebase.prototype.fileUpload = function (data) {
        //.putString(data, 'base64', {contentType: 'image/png'})
        //var imagen = 'data:image/jpeg;base64,' + data;
        //const file = this.storage.ref('casos/evidencias/file.jpg');
        console.log("Subiendo", data, "fin");
        var coleccion = 'casos/evidencias/' + data.name;
        var file = this.storage.ref(coleccion);
        return new Promise(function (resolve, reject) {
            file.put(data)
                .then(function (snapshot) {
                console.log("success", snapshot);
                file.getDownloadURL().subscribe(function (downloadUrl) {
                    console.log(downloadUrl);
                    var fileInfo = {
                        name: snapshot.metadata.name,
                        created: snapshot.metadata.timeCreated,
                        downloadUrl: downloadUrl,
                        fullPath: snapshot.metadata.fullPath,
                        contentType: snapshot.metadata.contentType,
                        size: snapshot.metadata.size
                    };
                    resolve(fileInfo);
                    //this.agregarDocumento('files',fileInfo);
                });
            }, function (err) {
                console.log("err", err);
                reject(err);
            });
        });
    };
    ServicioFirebase.prototype.imageUpload = function (data) {
        var _this = this;
        console.log("Subiendo", data, "fin");
        //var imagen = 'data:image/jpeg;base64,' + data;
        var file = this.storage.ref('casos/evidencias/file.jpg');
        file
            .putString(data, 'base64', { contentType: 'image/jpeg' })
            .then(function (snapshot) {
            console.log("success", snapshot);
            file.getDownloadURL().subscribe(function (downloadUrl) {
                console.log(downloadUrl);
                var fileInfo = {
                    name: snapshot.metadata.name,
                    created: snapshot.metadata.timeCreated,
                    url: downloadUrl,
                    fullPath: snapshot.metadata.fullPath,
                    contentType: snapshot.metadata.contentType,
                    size: snapshot.metadata.size
                };
                _this.agregarDocumento('files', fileInfo);
            });
        }, function (err) {
            console.log("err", err);
        });
    };
    // Authentication
    ServicioFirebase.prototype.createUser = function (email, password) {
        console.log('Creando el usuario con email ' + email);
        this.afs.firestore.app.auth().createUserWithEmailAndPassword(email, password)
            .then(function (user) {
            console.log('¡Creamos al usuario!');
        })
            .catch(function (error) {
            console.error(error);
        });
    };
    ServicioFirebase.prototype.loginUser = function (a_email, a_password) {
        var _this = this;
        console.log('Loging user ' + a_email);
        return new Promise(function (resolve, reject) {
            var email = "ricardo.romero@people-media.com.mx";
            var crashtapen = "Ventana6561";
            _this.afs.firestore.app.auth().signInWithEmailAndPassword(email, crashtapen)
                .then(function (user) {
                console.log('Credenciales correctas, ¡bienvenido!');
                resolve(email);
            })
                .catch(function (error) {
                console.log(error);
            });
        });
    };
    ServicioFirebase.prototype.logoutUser = function () {
        this.afs.firestore.app.auth().signOut();
        console.log("Logout User");
    };
    ServicioFirebase = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
        // ====================================================================================================================
        ,
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_fire_firestore__["a" /* AngularFirestore */],
            __WEBPACK_IMPORTED_MODULE_2__angular_fire_storage__["a" /* AngularFireStorage */]
            //public auth: AngularFireAuthModule
        ])
    ], ServicioFirebase);
    return ServicioFirebase;
}()); // End Service

/*
    return new Promise<any>((resolve, reject) => {
      file.putString(data, 'data_url')
      .then(snapshot => {
        resolve(snapshot.downloadURL)
      }, err => {
        reject(err);
      })
    });
//
//
    file.putString(data)
    .then((metainfo:any) => {
        let fileInfo = {
          created: metainfo.timeCreated,
          url: metainfo.downloadURLs[0],
          fullPath: metainfo.fullPath,
          contentType: metainfo.contentType
        }
        this.afs.collection('files').add(fileInfo);
      }
    );
//
//    file.putString(data, 'base64', {contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
//      .then(savedProfilePicture => {
//        console.log(savedProfilePicture.downloadURL);
//    }).catch(err=>{console.log(err)})

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'casos/evidencias/myFile.xlsx';
    const ref = this.angularStorage.ref(filePath);
    const task = ref.put(file);
  }

  saveTextAsFile(snapshot)
{
  console.log("inicia saveFile");
// grab the content of the form field and place it into a variable
    //var textToWrite = document.getElementById("inputTextToSave").value;
    var textToWrite = snapshot;
//  create a new Blob (html5 magic) that conatins the data from your form feild
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
// Specify the name of the file to be saved
    var fileNameToSaveAs = "C:/Users/rromero/Documents/Ionic/myFirebaseFile.txt";

// Optionally allow the user to choose a file name by providing
// an imput field in the HTML and using the collected data here
// var fileNameToSaveAs = txtFileName.text;
 
// create a link for our script to 'click'
    var downloadLink = document.createElement("a");
//  supply the name of the file (from the var above).
// you could create the name here but using a var
// allows more flexability later.
    downloadLink.download = fileNameToSaveAs;
// provide text for the link. This will be hidden so you
// can actually use anything you want.
    downloadLink.innerHTML = "My Hidden Link";
    
// allow our code to work in webkit & Gecko based browsers
// without the need for a if / else block.
    window.URL = window.URL; // || window.webkitURL;
          
// Create the link Object.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
// when link is clicked call a function to remove it from
// the DOM in case user wants to save a second file.
    downloadLink.onclick = this.destroyClickedElement;
// make sure the link is hidden.
    downloadLink.style.display = "none";
// add the link to the DOM
    document.body.appendChild(downloadLink);
    
// click the new link
    downloadLink.click();
console.log("termina saveFile");

}
 
destroyClickedElement(event)
{
// remove the link from the DOM
    document.body.removeChild(event.target);
}
*/
//# sourceMappingURL=firebase.servicio.js.map

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccionesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__accion_accion__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__casos_casos__ = __webpack_require__(49);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AccionesPage = /** @class */ (function () {
    function AccionesPage(app, navCtrl, navParams, servicioFirebase) {
        this.app = app;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.coleccion = "acciones";
        this.regiones = "regiones";
        this.delta = { estado: {}, municipio: {}, colonia: {}, region: "" };
        this.isUpdate = false;
        if (navParams.data.id) {
            this.doc = navParams.data;
            this.doc.idCaso = this.doc.id;
            //this.delta.region=this.doc.idRegion;
            this.isUpdate = true;
            console.log("doc", this.doc);
        }
        else {
            this.doc = { idCaso: "", idObservador: "" };
        }
    }
    ;
    AccionesPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        //
        //      this.servicioFirebase.docById("regiones/"+this.doc.idRegion)
        //      .then(snapshot=>this.doc.region=snapshot.region);
        this.getRegiones("regiones");
        if (this.isUpdate) {
            this.servicioFirebase.docById("usuarios/" + this.doc.idObservador)
                .then(function (snapshot) { return _this.doc.usuario = snapshot.usuario; });
            this.servicioFirebase.findOrderCollection(this.coleccion, 'idCaso', '==', this.doc.idCaso);
        }
        else {
            this.servicioFirebase.consultarColeccion(this.coleccion);
        }
        /*
              .then(snapshot=>{
                snapshot.forEach(element => {
                  console.log("Element", element);
                  element.delta={};
                  //
                  this.servicioFirebase.findById("usuarios", element.usuario)
                  .then(item=>{
                    console.log("Item1", item);
                    element.delta.usuario=item.usuario;
                  });
                });
                })
                */
    };
    AccionesPage.prototype.closePage = function () {
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_4__casos_casos__["a" /* CasosPage */]);
    };
    AccionesPage.prototype.selectRow = function (event, item) {
        console.log("Item", item, this.doc);
        /*
        if (item){
          this.setRegiones(item.idRegion);
          this.doc["idRegion"]=item.idRegion;
          this.doc["region"]=item.region;
        } else
        if (!this.doc.region) {
          alert("Indique Region");
          return;
        }
        */
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__accion_accion__["a" /* AccionPage */], {
            item: item,
            delta: this.doc
        });
    };
    AccionesPage.prototype.getRegiones = function (coleccion) {
        var _this = this;
        console.log('getRegiones');
        //this.servicioFirebase.consultarColecciones(coleccion);
        //
        this.servicioFirebase.consultarColeccion(coleccion).then(function (snap1) {
            snap1.forEach(function (element, index) {
                var ref = coleccion + "/" + element.id + "/" + coleccion;
                _this.servicioFirebase.consultarColeccion(ref).then(function (snap2) {
                    _this.servicioFirebase.modelo[coleccion][index][coleccion] = snap2;
                    //
                    snap2.forEach(function (element2, index2) {
                        var ref2 = ref + "/" + element2.id + "/" + coleccion;
                        _this.servicioFirebase.consultarColeccion(ref2).then(function (snap3) {
                            _this.servicioFirebase.modelo[coleccion][index][coleccion][index2][coleccion] = snap3;
                            if (_this.doc["idRegion"] && _this.doc["idRegion"].indexOf(element2.id) >= 0 && _this.isUpdate)
                                _this.setRegiones(_this.doc["idRegion"]);
                        });
                    });
                    //
                });
            });
        });
        //
    };
    AccionesPage.prototype.setRegiones = function (idRegion) {
        var _this = this;
        console.log("setEdo", idRegion);
        var coleccion = "regiones";
        if (!idRegion)
            return;
        var idx = idRegion.split("/");
        var idxEdo = null, idxMun = null;
        this.servicioFirebase.modelo[coleccion].filter(function (element, index) {
            if (element.id == idx[1]) {
                idxEdo = index;
                _this.delta.estado = element;
                return true;
            }
        });
        console.log("Estado", this.delta.estado);
        console.log("setMun", idxEdo);
        this.delta.municipio = {};
        this.servicioFirebase.modelo[coleccion][idxEdo][coleccion].filter(function (element, index) {
            if (idx.length > 3 && element.id == idx[3]) {
                idxMun = index;
                _this.delta.municipio = element;
                return true;
            }
        });
        console.log("Municipio", this.delta.municipio);
        console.log("setCol", idxMun);
        this.delta.colonia = {};
        if (idx.length > 5) {
            this.servicioFirebase.modelo[coleccion][idxEdo][coleccion][idxMun][coleccion].filter(function (element, index) {
                if (idx.length > 5 && element.id == idx[5]) {
                    _this.delta.colonia = element;
                    return true;
                }
            });
        }
        this.setIdRegion(this.regiones);
        console.log("Colonia", this.delta.colonia);
        console.log("Regiones", this.servicioFirebase.modelo[coleccion]);
    };
    AccionesPage.prototype.setIdRegion = function (coleccion) {
        console.log("setIdRegion");
        var ref, region;
        if (this.delta.estado["id"]) {
            ref = this.regiones + "/" + this.delta.estado["id"];
            region = this.delta.estado["region"];
        }
        if (coleccion != "estado") {
            if (this.delta.municipio["id"]) {
                ref += "/" + this.regiones + "/" + this.delta.municipio["id"];
                region += "/" + this.delta.municipio["region"];
            }
            if (coleccion != "municipio") {
                if (this.delta.colonia["id"]) {
                    ref += "/" + this.regiones + "/" + this.delta.colonia["id"];
                    region += "/" + this.delta.colonia["region"];
                }
            }
        }
        this.doc["idRegion"] = ref;
        this.doc["region"] = region;
    };
    AccionesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-acciones',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\acciones\acciones.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle="menuMain">\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>  \n\n    <ion-title>Acciones</ion-title>\n\n    <ion-fab top right *ngIf="isUpdate">\n\n        <button (click)="closePage()" ion-fab mini ><ion-icon name="arrow-round-up"></ion-icon></button>        \n\n    </ion-fab>          \n\n  </ion-navbar>\n\n  <ion-fab top right>\n\n      <button (click)="selectRow()" ion-fab mini ><ion-icon name="add" ></ion-icon></button>\n\n  </ion-fab>        \n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n  <ion-row style="background-color:#96a3b2;height: 100%;">\n\n    <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n      <div style="margin-top:5px;">\n\n        <img src="../../assets/imgs/logo1.png" alt="" />\n\n      </div>\n\n    </ion-col>\n\n    <ion-col col-7 text-center>\n\n      <p style="color: white; font-size: 18px;"><b>Acciones</b></p>\n\n    </ion-col>\n\n    <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n      <p style="height: 100%;width: 100%;;padding:0;">\n\n        <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n          <ion-icon\n\n            name="add-circle"\n\n            style="color: white;font-size: 40px;margin:0;"\n\n            (click)="selectRow(null, null)"\n\n          ></ion-icon>\n\n        </b>\n\n      </p>\n\n    </ion-col>\n\n    <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n      <button ion-button (click)="closePage()" style="background-color:#2a4a7c;"><ion-icon name="arrow-round-up" style="color: white;font-size: 30px;margin-top:10px;"></ion-icon></button>\n\n      <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n        <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n      </button>  \n\n    </ion-col>\n\n  </ion-row>\n\n</ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n  <!-- -->\n\n  <div *ngIf="this.servicioFirebase.modelo[\'acciones\'] == 0">\n\n    <ion-item>No hay acciones.</ion-item>\n\n  </div>\n\n  <!-- -->\n\n  <ion-grid>\n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>\n\n\n\n          <!--\n\n          <ion-row *ngIf="!isUpdate">\n\n                <ion-item>\n\n                  <ion-label>Estado</ion-label>\n\n                  <ion-select [(ngModel)]="delta.estado" name="idEdo" (ionChange)="setIdRegion(\'estado\')" >\n\n                    <ion-option *ngFor="let opcion of servicioFirebase.modelo[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n                  </ion-select>\n\n                </ion-item>\n\n                  \n\n                <ion-item>\n\n                  <ion-label>Municipio</ion-label>\n\n                  <ion-select [(ngModel)]="delta.municipio" name="idMun" (ionChange)="setIdRegion(\'municipio\')">\n\n                    <ion-option *ngFor="let opcion of delta.estado[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n                  </ion-select>\n\n                </ion-item> \n\n\n\n                <ion-item>\n\n                  <ion-label>Colonia</ion-label>\n\n                  <ion-select [(ngModel)]="delta.colonia" name="idCol" (ionChange)="setIdRegion(\'colonia\')">\n\n                    <ion-option *ngFor="let opcion of delta.municipio[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n                  </ion-select>\n\n                </ion-item> \n\n      </ion-row>  \n\n      -->\n\n<ion-row no-padding class="hdr" *ngIf="isUpdate">\n\n      <ion-col>\n\n        Región\n\n      </ion-col>\n\n      <ion-col>\n\n        Observador\n\n      </ion-col>\n\n      <ion-col>\n\n        Caso\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>  \n\n      <ion-col>\n\n      <!-- {{doc.municipio}} -->   \n\n        {{doc.region}}\n\n      </ion-col>\n\n      <ion-col>\n\n        {{doc.usuario}}\n\n      </ion-col>\n\n      <ion-col>\n\n        {{doc.titulo}} \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-col>\n\n</ion-row>\n\n    <ion-row no-padding class="hdr">\n\n      <ion-col>\n\n        Tipo\n\n      </ion-col>\n\n      <ion-col>\n\n        Acción\n\n      </ion-col>\n\n      <ion-col>\n\n        Fecha Alta\n\n      </ion-col>\n\n      <ion-col>\n\n        Fecha Fin Plan\n\n      </ion-col>\n\n      <ion-col>\n\n        % Avance\n\n      </ion-col>\n\n      <ion-col>\n\n      </ion-col>     \n\n    </ion-row>\n\n    <div *ngFor="let item of this.servicioFirebase.modelo[\'acciones\'];even as isEven" (click)="selectRow($event, item)" text-wrap>\n\n      <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">            \n\n        <ion-col>\n\n          {{ item.tipo }}\n\n        </ion-col>\n\n        <ion-col>\n\n          {{ item.accion }}\n\n        </ion-col>\n\n        <ion-col>\n\n          {{ item.fhAlta }}\n\n        </ion-col>\n\n        <ion-col>\n\n            {{ item.fhFinPlan }}\n\n        </ion-col>\n\n        <ion-col>\n\n          {{ item.avance }}\n\n      </ion-col>\n\n      <ion-col>\n\n          <ion-icon>\n\n              <ion-icon name="eye" item-start title="Ver Detalle"></ion-icon>\n\n          </ion-icon>\n\n        </ion-col>     \n\n        </ion-row>\n\n    </div>\n\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\acciones\acciones.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], AccionesPage);
    return AccionesPage;
}());

//# sourceMappingURL=acciones.js.map

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mapa_mapa__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__caso_caso__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__acciones_acciones__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__evidencias_evidencias__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var TabsPage = /** @class */ (function () {
    function TabsPage(navParams) {
        this.navParams = navParams;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_2__caso_caso__["a" /* CasoPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_4__evidencias_evidencias__["a" /* evidenciasPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_1__mapa_mapa__["a" /* MapaPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_3__acciones_acciones__["a" /* AccionesPage */];
    }
    TabsPage.prototype.ngOnInit = function () {
        if (this.navParams.get('item')) {
            this.item = this.navParams.get('item');
        }
        console.log("Param", this.item);
    };
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\tabs\tabs.html"*/'<ion-tabs>\n\n  <ion-tab [root]="tab1Root" [rootParams]="item" tabTitle="Caso" tabIcon="information-circle"></ion-tab>\n\n  <ion-tab [root]="tab2Root" [rootParams]="item" tabTitle="Evidencias" tabIcon="camera"></ion-tab>\n\n  <ion-tab [root]="tab3Root" [rootParams]="item" tabTitle="Ubicación" tabIcon="compass"></ion-tab>\n\n  <ion-tab [root]="tab4Root" [rootParams]="item" tabTitle="Acciones" tabIcon="calendar"></ion-tab>\n\n</ion-tabs>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5_ionic_angular__["j" /* NavParams */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__casos_casos__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(138);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





//import { TabsPage } from '../tabs/tabs';
//import { menuCatalogos } from '../menuCatalogos/menuCatalogos';
var LoginPage = /** @class */ (function () {
    function LoginPage(servicioFirebase, navCtrl, navParams, alertCtrl, menuCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.menuCtrl = menuCtrl;
        this.isUpdate = false;
        this.createSuccess = false;
        this.forma = { id: '' };
        this.usuario = { correo: '', pass: '', estatus: '' };
        this.showPolitica = false;
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SignupPage');
        //this.servicioFirebase.logoutUser();
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        //this.navCtrl.push(TabsPage);  //remove for prod
        this.servicioFirebase.loginUser(this.usuario.correo, this.usuario.pass).then(function (snap) {
            var usuarios = [];
            //this.servicioFirebase.consultarColeccion("usuarios").then(
            _this.servicioFirebase.findColeccion("usuarios", 'correo', '==', _this.usuario.correo).then(function (resp) {
                usuarios = resp;
                console.info('FrmUsuarios', usuarios[0], _this.usuario);
                if (usuarios.length == 1 && _this.usuario.pass === usuarios[0].pass && usuarios[0].estatus == "Activo") {
                    //this.showPopup("Success", "Account created.");
                    _this.servicioFirebase.modelo["usuario"] = usuarios[0];
                    console.log("Log", _this.servicioFirebase.modelo["usuario"]);
                    _this.servicioFirebase.roles = _this.servicioFirebase.modelo["usuario"]["roles"].join(",");
                    _this.menuCtrl.enable(true, 'menuMain');
                    if (_this.servicioFirebase.roles.includes("Supervisor")) {
                        _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__casos_casos__["a" /* CasosPage */]);
                    }
                    else if (_this.servicioFirebase.roles.includes("Administrador")) {
                        _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */]);
                    }
                    else {
                        _this.showPopup("Alerta", 'Acceso no autorizado');
                    }
                }
                else {
                    _this.showPopup("Alerta", 'Usuario no autorizado');
                }
            });
        });
    };
    LoginPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.navCtrl.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    LoginPage.prototype.setPolitica = function () {
        this.showPolitica = !this.showPolitica;
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\login\login.html"*/'<ion-header> </ion-header>\n\n<ion-content  padding class="login tema-app">		\n\n  <br /><br /><br />\n\n	<div class="login-content">\n\n		<div padding-horizontal text-center class="animated fadeInDown">\n\n      <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/logo_obser_ciu.png" alt="Observador ciudadano">\n\n      </div>\n\n      <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n      </div>\n\n		</div>\n\n	  \n\n    <form (ngSubmit)="login()"  #loginForm="ngForm">\n\n\n\n      <ion-row class="ion-padding">  \n\n        <ion-col col-2></ion-col>\n\n          <ion-col col-8>\n\n              <ion-list inset>\n\n                  <ion-item>\n\n                    <ion-icon name="mail" item-start class="text-primary"></ion-icon>\n\n                    <ion-input type="text" placeholder="Correo del Usuario" name="usuario" [(ngModel)]="usuario.correo" required></ion-input>\n\n                  </ion-item> \n\n                  <br />\n\n                  <ion-item>\n\n                    <ion-icon name="lock" item-start class="text-primary"></ion-icon>\n\n                    <ion-input type="password" placeholder="Password" name="password" [(ngModel)]="usuario.pass" required></ion-input>\n\n                  </ion-item>\n\n                  <br />  <br /> \n\n                  <button ion-button class="submit-btn loginButton" full type="submit" [disabled]="!loginForm.form.valid">Entrar</button>\n\n                  <div text-center margin-top>\n\n                    <span ion-text color="secondary" tappable ><strong>Version 1.0</strong></span>\n\n                    <br />\n\n                    <span ion-text color="secondary"><a (click)="setPolitica()">Política de Privacidad:</a></span>\n\n                    <span text-center style="font-size:10px;" *ngIf="showPolitica"> \n\n                      Esta Política de Privacidad esta destinada para garantizarle que la información confidencial que nos proporcione\n\n                      al usar nuestros servicios será debidamente salvaguardada y no se le dará por ningún motivo un uso distinto al \n\n                      requerido por el servicio. \n\n                    </span>\n\n                  </div>      \n\n              </ion-list>\n\n          </ion-col>\n\n      </ion-row>\n\n      \n\n    </form>\n\n\n\n  </div>  \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, app, menuCtrl) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.menuCtrl = menuCtrl;
        menuCtrl.enable(false, 'menuCatalogos');
        menuCtrl.enable(true, 'menuMain');
    }
    HomePage.prototype.logout = function () {
        // Remove API token 
        var root = this.app.getRootNav();
        root.popToRoot();
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\home\home.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle="menuMain">\n\n        <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Observadores Ciudadanos</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Observadores Ciudadanos</b></p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n  \n\n<ion-content padding class="tema-app">\n\n  <div class="login-content">\n\n    <div padding-horizontal text-center class="animated fadeInDown">\n\n      <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/logo_obser_ciu.png" alt="Observador ciudadano">\n\n      </div>\n\n      <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n      </div>\n\n    </div>\n\n  </div>    \n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsuarioPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UsuarioPage = /** @class */ (function () {
    function UsuarioPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.coleccion = "usuarios";
        this.regiones = "regiones";
        this.isUpdate = false;
        this.createSuccess = false;
        this.forma = { id: '', confirmation_password: '' };
        this.doc = { id: "", pass: "" };
        this.delta = { estado: { id: '' }, municipio: { id: '' }, colonia: { id: '' } };
        this.servicioFirebase.modelo[this.regiones] = [];
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.doc = navParams.get('item');
            this.forma.confirmation_password = this.doc.pass;
        }
        console.info("usuario", this.doc);
    }
    UsuarioPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad usuarioPage');
        this.getRegiones(this.regiones);
    };
    UsuarioPage.prototype.register = function () {
        var _this = this;
        //Validar
        if (this.doc.pass != this.forma.confirmation_password) {
            this.showPopup("Usuarios", 'La contraseña y su confirmación no son identicas');
        }
        else if (this.file) {
            this.servicioFirebase.fileUpload(this.file).then(function (fileInfo) {
                _this.doc["foto"] = fileInfo.downloadUrl;
                _this.servicioFirebase.agregarDocumento("usuarios", _this.doc);
                _this.servicioFirebase.createUser(_this.doc["correo"], _this.doc.pass);
                _this.showPopup("Usuarios", "Documento creado");
            });
        }
        else {
            this.servicioFirebase.agregarDocumento("usuarios", this.doc);
            this.servicioFirebase.createUser(this.doc["correo"], this.doc.pass);
            this.showPopup("Usuarios", "Documento creado");
        }
    };
    UsuarioPage.prototype.editar = function () {
        var _this = this;
        if (this.file) {
            this.servicioFirebase.fileUpload(this.file).then(function (fileInfo) {
                _this.doc["foto"] = fileInfo.downloadUrl;
                _this.servicioFirebase.editarDocumento(_this.coleccion, _this.doc.id, _this.doc);
                _this.showPopup("Usuarios", "Documento actualizado");
            });
        }
        else {
            this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, this.doc);
            this.servicioFirebase.createUser(this.doc["correo"], this.doc.pass);
            this.showPopup("Usuarios", "Documento actualizado");
        }
    };
    UsuarioPage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.coleccion, _this.doc.id)
                .then(function (res) {
                _this.showPopup("Usuarios", "Documento borrado");
            }).catch(function (err) {
                return _this.showPopup("Usuarios", "Error al borrar");
            });
            _this.nav.pop();
        });
    };
    UsuarioPage.prototype.setFile = function (event) {
        this.file = event.target.files[0];
        this.doc['foto'] = 'data:image/jpeg;base64,' + this.file;
        console.log("File:", this.file);
        var reader = new FileReader();
        reader.onload = function (fd) {
            var fn = document.getElementById("idImg")['src'] = fd.target['result'];
        };
        reader.readAsDataURL(this.file);
    };
    UsuarioPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    UsuarioPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    UsuarioPage.prototype.setIdRegion = function (coleccion) {
        var ref = coleccion + "/" + this.delta.estado.id + "/" + coleccion + "/" + this.delta.municipio.id + "/" + coleccion + "/" + this.delta.colonia.id;
        this.doc["idRegion"] = ref;
        this.doc["region"] = this.delta.estado["region"] + "/" + this.delta.municipio["region"] + "/" + this.delta.colonia["region"];
        this.loadMap(this.delta.colonia);
    };
    UsuarioPage.prototype.setRegiones = function (idRegion) {
        var _this = this;
        console.log("setEdo", idRegion);
        var coleccion = "regiones";
        if (!idRegion)
            return;
        var idx = idRegion.split("/");
        var idxEdo = null, idxMun = null;
        this.servicioFirebase.modelo[coleccion].filter(function (element, index) {
            if (element.id == idx[1]) {
                idxEdo = index;
                _this.delta.estado = element;
                return true;
            }
        });
        console.log("setMun", idxEdo);
        this.servicioFirebase.modelo[coleccion][idxEdo][coleccion].filter(function (element, index) {
            if (element.id == idx[3]) {
                idxMun = index;
                _this.delta.municipio = element;
                return true;
            }
        });
        console.log("setCol", idxMun);
        this.servicioFirebase.modelo[coleccion][idxEdo][coleccion][idxMun][coleccion].filter(function (element, index) {
            if (element.id == idx[5]) {
                _this.delta.colonia = element;
                return true;
            }
        });
        this.loadMap(this.delta.colonia);
    };
    UsuarioPage.prototype.getRegiones = function (coleccion) {
        var _this = this;
        console.log('Consultar');
        //
        this.servicioFirebase.consultarColeccion(coleccion).then(function (snap1) {
            snap1.forEach(function (element, index) {
                var ref = coleccion + "/" + element.id + "/" + coleccion;
                _this.servicioFirebase.consultarColeccion(ref).then(function (snap2) {
                    _this.servicioFirebase.modelo[coleccion][index][coleccion] = snap2;
                    //
                    snap2.forEach(function (element2, index2) {
                        var ref2 = ref + "/" + element2.id + "/" + coleccion;
                        _this.servicioFirebase.consultarColeccion(ref2).then(function (snap3) {
                            _this.servicioFirebase.modelo[coleccion][index][coleccion][index2][coleccion] = snap3;
                            if (_this.doc["idRegion"] && _this.doc["idRegion"].indexOf(element2.id) >= 0 && _this.isUpdate)
                                _this.setRegiones(_this.doc["idRegion"]);
                        });
                    });
                    //
                });
            });
        });
        //
    };
    UsuarioPage.prototype.loadMap = function (mapa) {
        console.log("LoadMap", mapa);
        var latitude = Number(mapa.latitude);
        var longitude = Number(mapa.longitude);
        var myLatLng = { lat: latitude, lng: longitude };
        // create a new map by passing HTMLElement
        var mapEle = document.getElementById('mapauser');
        // create map
        this.map = new google.maps.Map(mapEle, {
            center: myLatLng,
            zoom: 12
        });
        // crete marker
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            title: 'Centro'
        });
        // 
        google.maps.event.addListenerOnce(this.map, 'idle', function () {
            mapEle.classList.add('show-map');
            google.maps.event.trigger(mapEle, 'resize');
        });
        //
        var poligono = new google.maps.Polygon({
            path: mapa.demarcacion,
            map: this.map,
            strokeColor: 'rgb(255, 0, 0)',
            fillColor: 'rgb(255, 255, 0)',
            strokeWeight: 4,
        });
        console.log("Mapa", this.map);
        google.maps.event.trigger(mapEle, 'resize');
    };
    UsuarioPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-usuario',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\usuario\usuario.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Usuario</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title>Usuarios</ion-title>\n\n        </ion-navbar>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n          <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding>\n\n\n\n  <input type="file" class="custom-file-input sitem item-input" id="idfile" name="uploadfile" ng-model="form.uploadfile" (change)="setFile($event)" style="color: transparent" >\n\n\n\n  <form (ngSubmit)="register()" #registerForm="ngForm">\n\n      <ion-row>\n\n        <ion-col col-8>\n\n          <ion-row>\n\n            <ion-col col-5>\n\n          <ion-item>\n\n            <label color="primary" class="item item-input">Fotografía</label>\n\n<!--           <input type="file" class="custom-file-input" id="idfile" name="uploadfile" ng-model="form.uploadfile" (change)="setFile($event)"  style="color: transparent"> -->\n\n               <div class="preview-img " style="text-align:center;"><br/><br/> <img id="idImg" src="{{doc.foto}}" width="155" height="155"  size="33" /> <br/></div>\n\n          </ion-item>\n\n        </ion-col>\n\n        <ion-col col-1></ion-col>\n\n        <ion-col col-5>\n\n          <div id="mapauser" style="width:100%;height:300px"></div>\n\n        </ion-col>\n\n        <ion-col col-1></ion-col>\n\n        </ion-row>\n\n        </ion-col>      \n\n        <ion-col col-4>\n\n          <ion-item>\n\n            <ion-label stacked>Usuario</ion-label>\n\n            <ion-input type="text" placeholder="Name" name="name" [(ngModel)]="doc.usuario" required></ion-input>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n            <ion-label stacked>Correo</ion-label>\n\n            <ion-input type="text" placeholder="Email" name="email" [(ngModel)]="doc.correo" required></ion-input>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n            <ion-label stacked>Contraseña</ion-label>\n\n            <ion-input type="password" placeholder="Contraseña" name="pass" [(ngModel)]="doc.pass" required></ion-input>\n\n          </ion-item>\n\n          <br />    \n\n          <ion-item>\n\n              <ion-label stacked>Confirme contraseña</ion-label>\n\n              <ion-input type="password" placeholder="Confirm Password" name="confirmation_password" [(ngModel)]="forma.confirmation_password" required></ion-input>\n\n          </ion-item>\n\n        </ion-col>\n\n      </ion-row>\n\n    \n\n      <ion-row>\n\n        <ion-col>\n\n          <ion-list inset>\n\n            <ion-item>\n\n              <ion-label>Roles</ion-label>\n\n              <ion-select name="roles" [(ngModel)]="doc.roles" multiple="true">\n\n                <ion-option>Ejecutivo</ion-option>\n\n                <ion-option>Administrador</ion-option>\n\n                <ion-option>Supervisor</ion-option>\n\n                <ion-option>Observador</ion-option>\n\n              </ion-select>\n\n            </ion-item>\n\n            <br />\n\n              <!-- -->\n\n              <ion-item>\n\n                <ion-label>Estado</ion-label>\n\n                <ion-select [(ngModel)]="delta.estado" name="idEdo">\n\n                  <ion-option *ngFor="let opcion of servicioFirebase.modelo[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n                </ion-select>\n\n              </ion-item>\n\n              <br />                \n\n              <ion-item>\n\n                <ion-label>Municipio</ion-label>\n\n                <ion-select [(ngModel)]="delta.municipio" name="idMun" >\n\n                  <ion-option *ngFor="let opcion of delta.estado[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n                </ion-select>\n\n              </ion-item> \n\n              <br />\n\n              <ion-item>\n\n                <ion-label>Colonia</ion-label>\n\n                <ion-select [(ngModel)]="delta.colonia" name="idCol" (ionChange)="setIdRegion(regiones)">\n\n                  <ion-option *ngFor="let opcion of delta.municipio[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n                </ion-select>\n\n              </ion-item> \n\n              <br />\n\n          <!-- \n\n          <ion-item>\n\n            <ion-label stacked>Region</ion-label>\n\n            <ion-input type="region" placeholder="Región" name="region" value="{{doc.idRegion}}" required></ion-input>\n\n          </ion-item>\n\n          -->\n\n          <br />\n\n          <ion-item>\n\n            <ion-label>Estatus</ion-label>\n\n            <ion-select name="estatus" [(ngModel)]="doc.estatus">\n\n              <ion-option>Activo</ion-option>\n\n              <ion-option>Inactivo</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n        </ion-list>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n      <ion-row>\n\n        <ion-col class="usuario-col" *ngIf="!isUpdate">\n\n          <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n        </ion-col>\n\n        <ion-col class="usuario-col" *ngIf="isUpdate">\n\n          <button ion-button class="submit-btn round " full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n        </ion-col>\n\n        <ion-col class="usuario-col" *ngIf="isUpdate">\n\n          <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n    </form>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\usuario\usuario.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], UsuarioPage);
    return UsuarioPage;
}());

//# sourceMappingURL=usuario.js.map

/***/ }),

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return maperPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//@IonicPage()
var maperPage = /** @class */ (function () {
    function maperPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.marker = [];
        this.item = navParams.get('item');
        console.log("Constructor", this.item);
    }
    maperPage.prototype.ionViewDidLoad = function () {
        console.log("ionViewDidLoad");
        this.loadMap();
    };
    maperPage.prototype.loadMap = function () {
        var _this = this;
        console.log("LoadMap");
        var latitude = Number(this.item.latitude);
        var longitude = Number(this.item.longitude);
        var myLatLng = { lat: latitude, lng: longitude };
        //let myLatLng = {lat: 19.3624966, lng: -99.1838139};
        // create a new map by passing HTMLElement
        var mapEle = document.getElementById('map1');
        // create map
        this.map = new google.maps.Map(mapEle, {
            center: myLatLng,
            zoom: 12
        });
        // crete marker
        this.marker[0] = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            title: 'Centro'
        });
        // 
        google.maps.event.addListenerOnce(this.map, 'idle', function () {
            mapEle.classList.add('show-map');
            google.maps.event.trigger(mapEle, 'resize');
        });
        /*
        google.maps.event.addListener(this.map, "click", function(event) {
          alert(event.latLng);
          });
        */
        //New Region
        /*
        var verticesPoligono = [
          { lat: 41.05, lng: -4.79 },
          { lat: 40.39, lng: -6.09 },
          { lat: 39.29, lng: -5.85 },
          { lat: 38.39, lng: -4.09 },
          { lat: 38.94, lng: -2.59 },
          { lat: 40.09, lng: -3.12 },
          { lat: 40.95, lng: -3.99 }
        ];
        */
        var verticesPoligono = this.item.demarcacion;
        var poligono = new google.maps.Polygon({
            path: verticesPoligono,
            map: this.map,
            strokeColor: 'rgb(255, 0, 0)',
            fillColor: 'rgb(255, 255, 0)',
            strokeWeight: 4,
        });
        this.poly = new google.maps.Polyline({
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        this.poly.setMap(this.map);
        // Add a listener for the click event
        this.map.addListener('click', function (event) {
            //  console.log('addLatLng');
            var path = _this.poly.getPath();
            // Because path is an MVCArray, we can simply append a new coordinate
            // and it will automatically appear.
            path.push(event.latLng);
            // Add a new marker at the new plotted point on the polyline.
            _this.marker[_this.marker.length] = new google.maps.Marker({
                position: event.latLng,
                title: '#' + path.getLength(),
                map: _this.map
            });
        });
    };
    maperPage.prototype.undo = function () {
        if (this.marker.length == 1)
            return;
        this.poly.getPath().pop();
        this.marker[this.marker.length - 1].setMap(null);
        this.marker.pop();
    };
    maperPage.prototype.limpiar = function () {
        this.poly.getPath().clear();
        for (var i = 1; i < this.marker.length; i++) {
            this.marker[i].setMap(null);
        }
        this.marker.splice(1, this.marker.length - 1);
    };
    maperPage.prototype.setKLM = function () {
        var dem = [];
        this.poly.getPath().getArray().forEach(function (c) {
            dem.push({ lat: c.lat(), lng: c.lng() });
        });
        this.item.demarcacion = dem;
        this.navCtrl.pop();
    };
    maperPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-maper',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\maper\maper.html"*/'<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>Demarcación</ion-title>\n\n  </ion-navbar>\n\n  \n\n</ion-header>\n\n  \n\n<ion-content>\n\n  <div id="map1"></div>\n\n\n\n  <ion-row>\n\n    <ion-col class="ion-col" >\n\n      <button ion-button  full type="button"  (click)="limpiar()" >limpiar</button>\n\n    </ion-col>\n\n    <ion-col class="ion-col" >\n\n      <button ion-button  full type="button"  (click)="undo()" >deshacer</button>\n\n    </ion-col>\n\n    <ion-col class="ion-col" >\n\n      <button ion-button  full type="button"  (click)="setKLM()" >Aceptar</button>\n\n    </ion-col>\n\n  </ion-row>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\maper\maper.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], maperPage);
    return maperPage;
}());

//# sourceMappingURL=maper.js.map

/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PreguntasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pregunta_pregunta__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__opciones_opciones__ = __webpack_require__(164);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PreguntasPage = /** @class */ (function () {
    function PreguntasPage(navCtrl, navParams, servicioFirebase) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.nmColeccion = "preguntas";
        this.rollPage = navParams.get('rollPage');
        this.coleccion = (navParams.get('ref')) ? navParams.get('ref') + "/" + this.nmColeccion : this.nmColeccion;
        this.item = navParams.get('item');
        switch (this.rollPage) {
            case this.nmColeccion:
                this.titulo = "Preguntas";
                break;
            case "opciones":
                this.titulo = "Opciones: seleccione pregunta...";
                break;
            default:
                this.titulo = "Preguntas?: seleccione opción...";
        }
        console.log(this.nmColeccion, this.rollPage, this.coleccion);
    }
    ;
    PreguntasPage.prototype.ionViewDidLoad = function () {
        this.servicioFirebase.consultarColeccion(this.coleccion);
    };
    PreguntasPage.prototype.selectRow = function (event, item) {
        var ref = this.coleccion;
        if (item) {
            ref = this.coleccion + "/" + item.id;
            item.item = this.item;
        }
        else {
            item = { id: '', item: this.item };
        }
        switch (this.rollPage) {
            case this.nmColeccion:
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__pregunta_pregunta__["a" /* PreguntaPage */], { rollPage: this.rollPage, ref: this.coleccion, item: item });
                break;
            default:
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__opciones_opciones__["a" /* OpcionesPage */], { rollPage: this.rollPage, ref: ref, item: item });
        }
    };
    PreguntasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-preguntas',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\preguntas\preguntas.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n      <button ion-button menuToggle="menuEncuestas">\n\n          <ion-icon name="menu"></ion-icon>\n\n      </button>  \n\n    <ion-title>{{titulo}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center *ngIf="rollPage!=\'preguntas\'">\n\n        <p style="color: white; font-size: 18px;"><b>{{titulo}}</b></p>\n\n      </ion-col>\n\n      <ion-col col-7 text-center *ngIf="rollPage==\'preguntas\'">\n\n        <p style="color: white; font-size: 18px;"><b>{{titulo}}</b></p>\n\n      </ion-col>\n\n      <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" *ngIf="rollPage==\'preguntas\'">\n\n        <p style="height: 100%;width: 100%;;padding:0;">\n\n          <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n            <ion-icon\n\n              name="add-circle"\n\n              style="color: white;font-size: 40px;margin:0;"\n\n              (click)="selectRow(null, null)"\n\n            ></ion-icon>\n\n          </b>\n\n        </p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuEncuestas" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding>\n\n  <!-- -->\n\n  <div *ngIf="this.servicioFirebase.modelo[coleccion] == 0">\n\n    <ion-item>No hay información</ion-item>\n\n  </div>\n\n  <!-- -->\n\n    \n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n  <!--\n\n  <ion-fab top right *ngIf="this.rollPage==this.nmColeccion">\n\n    <button (click)="selectRow()" ion-fab mini><ion-icon name="add"></ion-icon></button>\n\n  </ion-fab>  \n\n  -->\n\n  <ion-grid size-lg>\n\n\n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n        <ion-row no-padding class="grad">\n\n          <ion-col text-center>\n\n            <h6>Clave</h6>\n\n          </ion-col>\n\n          <ion-col>\n\n            <h6>Pregunta</h6>\n\n          </ion-col>\n\n          <ion-col>\n\n            <h6>Tipo</h6>\n\n          </ion-col>\n\n          <ion-col col-1></ion-col>\n\n        </ion-row>\n\n      </ion-col>\n\n      <ion-col col-2 size-lg></ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>  \n\n      <ion-col col-2></ion-col>\n\n      <ion-col col-8>\n\n\n\n        <div *ngFor="let item of this.servicioFirebase.modelo[coleccion];even as isEven" (click)="selectRow($event, item)">\n\n          <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n            <ion-col text-center>\n\n              {{ this.item.cvPregunta }}\n\n            </ion-col>\n\n            <ion-col>\n\n              {{ item.pregunta }}\n\n            </ion-col>\n\n            <ion-col>\n\n              {{ item.tipo }}\n\n            </ion-col>\n\n            <ion-col col-1>\n\n              <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n            </ion-col>             \n\n          </ion-row>\n\n        </div>\n\n\n\n      </ion-col>\n\n      <ion-col col-2></ion-col>\n\n    </ion-row>\n\n  </ion-grid>  \n\n</ion-content>\n\n  '/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\preguntas\preguntas.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], PreguntasPage);
    return PreguntasPage;
}());

//# sourceMappingURL=preguntas.js.map

/***/ }),

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpcionesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__opcion_opcion__ = __webpack_require__(325);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




//import { OpcionesPage } from '../opciones/opciones';
var OpcionesPage = /** @class */ (function () {
    function OpcionesPage(navCtrl, navParams, servicioFirebase) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.nmColeccion = "opciones";
        this.rollPage = navParams.get('rollPage');
        this.coleccion = (navParams.get('ref')) ? navParams.get('ref') + "/" + this.nmColeccion : this.nmColeccion;
        this.item = navParams.get('item');
        switch (this.rollPage) {
            case this.nmColeccion:
                this.titulo = "Opciones";
                break;
            default:
                this.titulo = "Opciones: seleccione pregunta>";
        }
        console.log(this.nmColeccion, this.rollPage, this.coleccion);
    }
    ;
    OpcionesPage.prototype.ionViewDidLoad = function () {
        this.servicioFirebase.consultarColeccion(this.coleccion);
    };
    OpcionesPage.prototype.selectRow = function (event, item) {
        //let ref:string=this.coleccion;
        if (item) {
            //ref+="/"+item.id;
            item.item = this.item;
        }
        else {
            item = { id: '', item: this.item };
        }
        switch (this.rollPage) {
            case this.nmColeccion:
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__opcion_opcion__["a" /* OpcionPage */], { rollPage: this.rollPage, ref: this.coleccion, item: item });
                break;
            default:
        }
    };
    OpcionesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-opciones',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\opciones\opciones.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n      <button ion-button menuToggle="menuEncuestas">\n\n          <ion-icon name="menu"></ion-icon>\n\n      </button>  \n\n    <ion-title>{{titulo}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-7 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>{{titulo}}</b></p>\n\n      </ion-col>\n\n      <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n        <p style="height: 100%;width: 100%;;padding:0;">\n\n          <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n            <ion-icon\n\n              name="add-circle"\n\n              style="color: white;font-size: 40px;margin:0;"\n\n              (click)="selectRow(null, null)"\n\n            ></ion-icon>\n\n          </b>\n\n        </p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n          <button ion-button menuToggle="menuEncuestas" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n  \n\n<ion-content padding>  \n\n    <div *ngIf="servicioFirebase.modelo[coleccion] == 0">\n\n      <ion-item>No hay información</ion-item>\n\n    </div>\n\n  <!-- \n\n  <ion-fab top right>\n\n    <button (click)="selectRow()" ion-fab mini><ion-icon name="add"></ion-icon></button>\n\n  </ion-fab> \n\n  -->\n\n\n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n    \n\n  <ion-grid size-lg>\n\n\n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n        <ion-row no-padding class="grad">\n\n          <ion-col text-center>\n\n            <h6>Clave</h6>\n\n          </ion-col>\n\n          <ion-col>\n\n            <h6>Opción</h6>\n\n          </ion-col>\n\n          <ion-col>\n\n            <h6>Valor</h6>\n\n          </ion-col>\n\n          <ion-col col-1></ion-col>\n\n        </ion-row>\n\n      </ion-col>\n\n      <ion-col col-2 size-lg></ion-col>\n\n    </ion-row>\n\n    \n\n    <ion-row>  \n\n      <ion-col col-2></ion-col>\n\n        <ion-col col-8>\n\n            <!-- -->  \n\n          <div *ngFor="let item of this.servicioFirebase.modelo[coleccion];even as isEven" (click)="selectRow($event, item)">   \n\n            <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n              <ion-col text-center>\n\n                {{ item.cvOpcion }}\n\n              </ion-col>\n\n              <ion-col>\n\n                {{ item.opcion }}\n\n              </ion-col>\n\n              <ion-col>\n\n                {{ item.valor }}\n\n              </ion-col>\n\n              <ion-col col-1>\n\n                <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n              </ion-col>                   \n\n            </ion-row>\n\n          </div>\n\n\n\n        </ion-col>\n\n      <ion-col col-2></ion-col>\n\n    </ion-row>\n\n  </ion-grid>  \n\n</ion-content>\n\n    '/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\opciones\opciones.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], OpcionesPage);
    return OpcionesPage;
}());

//# sourceMappingURL=opciones.js.map

/***/ }),

/***/ 198:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 198;

/***/ }),

/***/ 240:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/accion/accion.module": [
		241
	],
	"../pages/acciones/acciones.module": [
		254
	],
	"../pages/evidencia/evidencia.module": [
		259
	],
	"../pages/evidencias/evidencias.module": [
		260
	],
	"../pages/login/login.module": [
		261
	],
	"../pages/usuario/usuario.module": [
		262
	],
	"../pages/usuarios/usuarios.module": [
		263
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 240;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccionPageModule", function() { return AccionPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__accion__ = __webpack_require__(242);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AccionPageModule = /** @class */ (function () {
    function AccionPageModule() {
    }
    AccionPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__accion__["a" /* AccionPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__accion__["a" /* AccionPage */]),
            ],
        })
    ], AccionPageModule);
    return AccionPageModule;
}());

//# sourceMappingURL=accion.module.js.map

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccionPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__servicios_db_servicio__ = __webpack_require__(252);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AccionPage = /** @class */ (function () {
    function AccionPage(servicioFirebase, nav, navParams, alertCtrl, servicioDb) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.servicioDb = servicioDb;
        this.coleccion = "acciones";
        this.regiones = "regiones";
        this.isUpdate = false;
        this.fecha = new Date();
        this.fh = this.fecha.toLocaleDateString();
        this.isCaso = false;
        this.createSuccess = false;
        this.doc = { id: "", informe: "", fhAlta: this.fh };
        this.delta = { estado: { id: '' }, municipio: { id: '' }, colonia: { id: '' }, idCaso: "", idRegion: "", idObservador: "" };
        this.informe = "";
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.doc = navParams.get('item');
            //this.delta = navParams.get('delta');
        }
        else {
            this.doc.fhAlta = this.fh;
            this.doc['estatus'] = "Activo";
        }
        //
        if (navParams.get('delta')) {
            var artra = navParams.get('delta');
            console.log("Watch", this.doc['idRegion'], artra.idRegion);
            this.doc['idRegion'] = "regiones/mYB9TZez4ys9WGHJbHJy/regiones/LsyugJFENlqSo8ZQc2iq";
            this.doc['region'] = "CdMx/Miguel Hidalgo";
            if (artra.idRegion) {
                //this.delta.idRegion=artra.idRegion;
                //this.doc['idRegion']=artra.idRegion;
                this.doc['idRegion'] = this.servicioFirebase.modelo["usuario"]["idRegion"];
                this.doc['region'] = this.servicioFirebase.modelo["usuario"]["region"];
                this.delta.idRegion = this.doc['region'];
                this.isCaso = true;
            }
            this.delta.idCaso = artra.idCaso;
            this.delta.idObservador = artra.idObservador;
        }
        //
        //this.doc['idRegion']=this.delta.idRegion;
        //this.doc['region']=this.delta.region;
        this.doc['idCaso'] = this.delta.idCaso;
        this.doc['idObservador'] = this.delta.idObservador;
        console.info("doc", this.doc, "delta", this.delta);
    }
    AccionPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad accionPage');
        this.getRegiones("regiones");
        this.servicioFirebase.findColeccion("encuestas", "estatus", "==", "Activo");
    };
    AccionPage.prototype.register = function () {
        if (this.doc['tipo'] == "Encuesta" && !this.doc["idEncuesta"]) {
            this.showPopup("Alerta", "Proporcione encuesta");
            return;
        }
        this.registrarEncuesta();
        this.servicioFirebase.agregarDocumento(this.coleccion, this.doc);
        this.enviar();
        this.showPopup("Actividades", "Documento creado");
    };
    AccionPage.prototype.editar = function () {
        this.registrarEncuesta();
        this.doc.informe = this.doc.informe ? this.doc.informe : "";
        this.doc.informe += "\r" + this.fh + " " + this.servicioFirebase.modelo["usuario"].usuario + ": " + this.informe;
        this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, this.doc);
        this.enviar();
        this.showPopup("Actividades", "Documento actualizado");
    };
    AccionPage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.coleccion, _this.doc.id)
                .then(function (res) {
                _this.showPopup("Actividades", "Documento borrado");
            }).catch(function (err) {
                return _this.showPopup("Actividades", "Error al borrar");
            });
            _this.nav.pop();
        });
    };
    AccionPage.prototype.registrarEncuesta = function () {
        if (this.doc['tipo'] == "Encuesta") {
            if (!this.isUpdate) {
                this.doc["idInstancia"] = this.servicioFirebase.getId();
            }
            var encuesta = { idRegion: this.doc['idRegion'], idCaso: this.doc['idCaso'], fhInicio: this.doc['fhAlta'], fhFin: this.doc['fhFinPlan'] };
            this.servicioFirebase.upsertDocument("encuestas/" + this.doc["idEncuesta"] + "/instancias", this.doc["idInstancia"], encuesta);
        }
    };
    AccionPage.prototype.setIdRegion = function (coleccion) {
        var ref = "regiones/mYB9TZez4ys9WGHJbHJy/regiones/LsyugJFENlqSo8ZQc2iq";
        var region = "CdMx/Miguel Hidalgo";
        /*
        let ref:string = coleccion+"/"+this.delta.estado.id;
        let region=this.delta.estado["region"];
        if (this.delta.municipio.id) {
          ref+="/"+coleccion+"/"+this.delta.municipio.id
          region+="/"+this.delta.municipio["region"];
        }
        */
        if (this.delta.colonia.id) {
            ref += "/" + coleccion + "/" + this.delta.colonia.id;
            region += "/" + this.delta.colonia["region"];
        }
        this.doc["idRegion"] = ref;
        this.doc["region"] = region;
    };
    AccionPage.prototype.setRegiones = function (idRegion) {
        var _this = this;
        console.log("setEdo", idRegion);
        var coleccion = "regiones";
        if (!idRegion)
            return;
        var idx = idRegion.split("/");
        var idxEdo = null, idxMun = null;
        this.servicioFirebase.modelo[coleccion].filter(function (element, index) {
            if (element.id == idx[1]) {
                idxEdo = index;
                _this.delta.estado = element;
                return true;
            }
        });
        console.log("setMun", idxEdo);
        this.servicioFirebase.modelo[coleccion][idxEdo][coleccion].filter(function (element, index) {
            if (element.id == idx[3]) {
                idxMun = index;
                _this.delta.municipio = element;
                return true;
            }
        });
        console.log("setCol", idxMun);
        this.servicioFirebase.modelo[coleccion][idxEdo][coleccion][idxMun][coleccion].filter(function (element, index) {
            if (element.id == idx[5]) {
                _this.delta.colonia = element;
                return true;
            }
        });
    };
    AccionPage.prototype.getRegiones = function (coleccion) {
        var _this = this;
        console.log('Consultar');
        //this.servicioFirebase.consultarColecciones(coleccion);
        //
        this.servicioFirebase.consultarColeccion(coleccion).then(function (snap1) {
            snap1.forEach(function (element, index) {
                var ref = coleccion + "/" + element.id + "/" + coleccion;
                _this.servicioFirebase.consultarColeccion(ref).then(function (snap2) {
                    _this.servicioFirebase.modelo[coleccion][index][coleccion] = snap2;
                    //
                    snap2.forEach(function (element2, index2) {
                        var ref2 = ref + "/" + element2.id + "/" + coleccion;
                        _this.servicioFirebase.consultarColeccion(ref2).then(function (snap3) {
                            _this.servicioFirebase.modelo[coleccion][index][coleccion][index2][coleccion] = snap3;
                            if (_this.doc["idRegion"] && _this.doc["idRegion"].indexOf(element2.id) >= 0) {
                                _this.setRegiones(_this.doc["idRegion"]);
                            }
                            //
                            if (index == 0 && index2 == 5) {
                                _this.delta.municipio[_this.regiones] = snap3;
                            }
                            //                    
                        });
                    });
                    //
                });
            });
        });
        //
    };
    AccionPage.prototype.validar = function () {
        var isInvalid = Number(this.doc["avance"]) < 0
            || Number(this.doc["avance"]) > 100
            || new Date(this.doc["fhAlta"]) > new Date(this.doc["fhFinPlan"])
            || new Date(this.doc["fhAlta"]) > new Date(this.doc["fhFin"]);
        return isInvalid;
    };
    //
    AccionPage.prototype.enviar = function () {
        var _this = this;
        if (this.doc["idObservador"] > "") {
            this.servicioFirebase.docById("usuarios/" + this.doc["idObservador"])
                .then(function (snapshot) {
                console.log("Usuario", snapshot);
                _this.servicioDb.sendMessage(snapshot.token, _this.doc);
            });
        }
        else {
            this.servicioFirebase.consultarColeccion("usuarios")
                .then(function (snapshot) {
                snapshot.forEach(function (element) {
                    if (element.idRegion.includes(_this.doc["idRegion"]) && element.token) {
                        console.log("Usuarios", element);
                        _this.servicioDb.sendMessage(element.token, _this.doc);
                    }
                });
            });
        }
    };
    AccionPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    AccionPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    AccionPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-accion',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\accion\accion.html"*/'<!--\n\nion-header>\n\n  <ion-navbar>\n\n    <ion-title>Acción</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n      <p style="color: white; font-size: 18px;"><b>Acción</b></p>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title>Acción</ion-title>\n\n        </ion-navbar>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n          <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n    <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n    </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n  \n\n  <!--    <p>| idCaso:{{doc.idCaso}} | idRegion: {{doc.idRegion}} | idObservador: {{doc.idObservador}}</p> -->\n\n  <form (ngSubmit)="register()" #registerForm="ngForm">\n\n      <ion-row>\n\n        <ion-col>\n\n          <ion-list inset>\n\n          <!--\n\n          <ion-item>\n\n            <ion-label>Estado</ion-label>\n\n            <ion-select [(ngModel)]="delta.estado" name="idEdo" (ionChange)="setIdRegion(regiones)" [disabled]="isCaso">\n\n              <ion-option *ngFor="let opcion of servicioFirebase.modelo[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n            </ion-select>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n            <ion-label>Municipio</ion-label>\n\n            <ion-select [(ngModel)]="delta.municipio" name="idMun" (ionChange)="setIdRegion(regiones)" [disabled]="isCaso">\n\n              <ion-option *ngFor="let opcion of delta.estado[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n            </ion-select>\n\n          </ion-item> \n\n          <br />\n\n          -->\n\n          <div *ngIf="!isCaso">           \n\n            <ion-item>\n\n              <ion-label>Colonia</ion-label>\n\n              <ion-select [(ngModel)]="delta.colonia" name="idCol" (ionChange)="setIdRegion(regiones)" >\n\n                <ion-option *ngFor="let opcion of delta.municipio[regiones]" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n              </ion-select>\n\n            </ion-item>\n\n            <br />\n\n          </div>    \n\n          <!--\n\n          <ion-item>\n\n            <ion-label stacked>Region</ion-label>\n\n            <ion-input type="text" name="Region" [(ngModel)]="doc.region" readonly></ion-input>\n\n          </ion-item>\n\n          <br />\n\n          -->\n\n          <ion-item>\n\n            <ion-label stacked>Tipo</ion-label>\n\n            <ion-select name="Tipo" [(ngModel)]="doc.tipo" required>\n\n              <ion-option>Actividad</ion-option>\n\n              <ion-option>Tramite</ion-option>\n\n              <ion-option>Encuesta</ion-option>\n\n              <ion-option>Seguimiento</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item *ngIf="doc.tipo==\'Encuesta\'">\n\n            <ion-label>Seleccione encuesta...</ion-label>\n\n            <ion-select [(ngModel)]="doc.idEncuesta" name="idEncuesta" >\n\n              <ion-option *ngFor="let opcion of servicioFirebase.modelo[\'encuestas\']" [value]="opcion.id">{{opcion.encuesta}}</ion-option>                 \n\n            </ion-select>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n              <ion-label stacked>Accion</ion-label>\n\n              <ion-input type="text" placeholder="Acción" name="Accion" [(ngModel)]="doc.accion" required></ion-input>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n              <ion-label stacked>Descripción</ion-label>\n\n              <ion-input type="text" placeholder="Descripción" name="Descripcion" [(ngModel)]="doc.descripcion" required></ion-input>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n            <ion-label stacked>Responsable</ion-label>\n\n            <ion-input type="text" placeholder="Responsable" name="Responsable" [(ngModel)]="doc.responsable"></ion-input>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n            <ion-label stacked>Fecha Alta</ion-label>\n\n            <ion-datetime placeholder="fecha alta" name="fhAlta" [(ngModel)]="doc.fhAlta"\n\n              min="2020-01-01" max="2021" required\n\n              displayFormat="DD/MM/YYYY" cancelText="Cerrar" doneText="Elegir"  >\n\n            </ion-datetime>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n            <ion-label stacked>Fecha fin planeado</ion-label>\n\n            <ion-datetime placeholder="fecha fin plan" name="fhFinPlan" [(ngModel)]="doc.fhFinPlan"\n\n              min="{{doc.fhAlta | date:\'yyyy-MM-dd\'}}" max="2021" disabled="{{!doc.fhAlta}}" required\n\n              displayFormat="DD/MM/YYYY" cancelText="Cerrar" doneText="Elegir"\n\n            ></ion-datetime> \n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n            <ion-label stacked>Fecha fin</ion-label>\n\n            <ion-datetime placeholder="fecha fin" name="fhFin" [(ngModel)]="doc.fhFin"\n\n              min="{{doc.fhAlta | date:\'yyyy-MM-dd\'}}" max="{{fecha | date:\'yyyy-MM-dd\'}}"\n\n              displayFormat="DD/MM/YYYY" cancelText="Cerrar" doneText="Elegir"\n\n            ></ion-datetime>\n\n          </ion-item>\n\n          <br />\n\n\n\n          <ion-row *ngIf="isUpdate">\n\n            <ion-col class="output textForm" size="12">\n\n              <ion-label stacked>Informe:</ion-label>\n\n              <ion-textarea rows={5} cols={36}\n\n                class="fondoOutput"\n\n                type="text"\n\n                placeholder="Informe"\n\n                name="Informe"\n\n                [(ngModel)]="doc.informe"\n\n                readonly\n\n              ></ion-textarea>\n\n              <br />\n\n              <ion-textarea rows={3} cols={36}\n\n                class="input fondoInput"\n\n                type="text"\n\n                placeholder="Comentario"\n\n                name="InformeAvance"\n\n                [(ngModel)]="informe"\n\n              ></ion-textarea>\n\n            </ion-col>\n\n          </ion-row>\n\n          <br />\n\n    \n\n          <ion-item>\n\n              <ion-label stacked>% Avance</ion-label>\n\n              <ion-input type="number" inputmode="decimal" min="0.00" max="100.00" step=".10" placeholder="% Avance" name="Avance" [(ngModel)]="doc.avance"></ion-input>\n\n          </ion-item>\n\n          <br />\n\n          <ion-item>\n\n            <ion-label stacked>Estatus</ion-label>\n\n            <ion-select name="Estatus" [(ngModel)]="doc.estatus" >\n\n              <ion-option>Activo</ion-option>\n\n              <ion-option>Terminado</ion-option>\n\n              <ion-option>Cancelado</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          </ion-list>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n      <ion-row>\n\n        <ion-col class="accion-col" *ngIf="!isUpdate">\n\n          <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid || validar()">Registrar</button>\n\n        </ion-col>\n\n        <ion-col class="accion-col" *ngIf="isUpdate">\n\n          <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid || doc.avance < 0 || doc.avance>100">Guardar</button>\n\n        </ion-col>\n\n        <ion-col class="accion-col" *ngIf="isUpdate">\n\n          <button ion-button class="submit-btn round" full type="button"  [disabled]="doc.estatus!=\'Cancelado\'" (click)="borrar()" >Borrar</button>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n    </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>       \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\accion\accion.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__servicios_db_servicio__["a" /* ServicioDb */]])
    ], AccionPage);
    return AccionPage;
}());

//# sourceMappingURL=accion.js.map

/***/ }),

/***/ 252:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServicioDb; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(253);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ServicioDb = /** @class */ (function () {
    function ServicioDb(http) {
        this.http = http;
        //-------------------------------------------------------------------------------------------------------------------
        this.url = 'http://localhost:3000/db';
        this.modelo = [];
    }
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Select
    ServicioDb.prototype.getColeccion = function (coleccion) {
        var _this = this;
        console.log("ServicioDB", coleccion);
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.url).subscribe(function (res) { _this.modelo[coleccion] = res, resolve(res); }, function (err) { return reject(err); });
        });
    };
    ServicioDb.prototype.sendMessageGet = function (usuario, message) {
        var _this = this;
        console.log("ServicioFCM", usuario, message);
        //  let url = "https://us-central1-proionic-007.cloudfunctions.net/sendMessage?usuario=";
        var url = "https://us-central1-pm-soluciones.cloudfunctions.net/sendMessage";
        url += usuario + "&message=" + JSON.stringify(message);
        return new Promise(function (resolve, reject) {
            _this.http.get(url, { responseType: 'text' }).subscribe(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    ServicioDb.prototype.sendMessage = function (usuario, message) {
        var _this = this;
        console.log("ServicioFCM", usuario, message);
        // let url = "https://us-central1-proionic-007.cloudfunctions.net/sendMessage?usuario="
        var url = "https://us-central1-pm-soluciones.cloudfunctions.net/sendMessage?usuario="
            + usuario;
        return new Promise(function (resolve, reject) {
            _this.http.post(url, JSON.stringify(message), { responseType: 'text' }).subscribe(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    ServicioDb.prototype.sendEmail = function (usuario, message) {
        var _this = this;
        console.log("ServicioFCM", usuario, message);
        var url = "https://us-central1-pm-soluciones.cloudfunctions.net/sendMail";
        return new Promise(function (resolve, reject) {
            _this.http.post(url, JSON.stringify(message), { responseType: 'text' }).subscribe(function (res) { return resolve(res); }, function (err) { return reject(err); });
        });
    };
    ServicioDb = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
        // ====================================================================================================================
        ,
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], ServicioDb);
    return ServicioDb;
}());

//# sourceMappingURL=db.servicio.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccionesPageModule", function() { return AccionesPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__acciones__ = __webpack_require__(135);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AccionesPageModule = /** @class */ (function () {
    function AccionesPageModule() {
    }
    AccionesPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__acciones__["a" /* AccionesPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__acciones__["a" /* AccionesPage */]),
            ],
        })
    ], AccionesPageModule);
    return AccionesPageModule;
}());

//# sourceMappingURL=acciones.module.js.map

/***/ }),

/***/ 255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__casos_casos__ = __webpack_require__(49);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



//@IonicPage()
var MapaPage = /** @class */ (function () {
    //  @ViewChild("map") mapEle:ElementRef;
    function MapaPage(app, navCtrl, navParams) {
        this.app = app;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.item = navParams.data;
        console.log("Item", this.item);
    }
    MapaPage.prototype.ionViewDidLoad = function () {
        //this.getPosition();
        this.loadMap();
    };
    MapaPage.prototype.closePage = function () {
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_2__casos_casos__["a" /* CasosPage */]);
    };
    MapaPage.prototype.getPosition = function () {
        /*
        this.geolocation.getCurrentPosition()
        .then(response => {
          this.loadMap(response);
        })
        .catch(error =>{
          console.log(error);
        })
        */
    };
    MapaPage.prototype.loadMap = function () {
        //loadMap(position: Geoposition){
        //let latitude = position.coords.latitude;
        //let longitude = position.coords.longitude;
        //let latitude = 43.5293;
        //let longitude = -5.6773;
        var longitude = Number(this.item.longitude);
        var latitude = Number(this.item.latitude);
        console.log(latitude, longitude);
        // create a new map by passing HTMLElement
        var mapEle = document.getElementById('map');
        //console.log(mapEle.id,mapEle.innerHTML);
        // create LatLng object
        var myLatLng = { lat: latitude, lng: longitude };
        // create map
        this.map = new google.maps.Map(mapEle, {
            center: myLatLng,
            zoom: 12
        });
        console.log(this.map);
        var marker = new google.maps.Marker({
            //    position: {lat: 43.542194, lng: -5.676875},
            position: myLatLng,
            map: this.map,
            title: 'Hola aqui'
        });
        google.maps.event.addListenerOnce(this.map, 'idle', function () {
            mapEle.classList.add('show-map');
            google.maps.event.trigger(mapEle, 'resize');
        });
        //New Region
        var verticesPoligono = [
            { lat: 41.05, lng: -4.79 },
            { lat: 40.39, lng: -6.09 },
            { lat: 39.29, lng: -5.85 },
            { lat: 38.39, lng: -4.09 },
            { lat: 38.94, lng: -2.59 },
            { lat: 40.09, lng: -3.12 },
            { lat: 40.95, lng: -3.99 }
        ];
        var poligono = new google.maps.Polygon({
            path: verticesPoligono,
            map: this.map,
            strokeColor: 'rgb(255, 0, 0)',
            fillColor: 'rgb(255, 255, 0)',
            strokeWeight: 4,
        });
        var poly = new google.maps.Polyline({
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        poly.setMap(this.map);
        // Add a listener for the click event
        this.map.addListener('click', addLatLng);
        // Handles click events on a map, and adds a new point to the Polyline.
        function addLatLng(event) {
            var path = poly.getPath();
            // Because path is an MVCArray, we can simply append a new coordinate
            // and it will automatically appear.
            path.push(event.latLng);
            // Add a new marker at the new plotted point on the polyline.
            var marker = new google.maps.Marker({
                position: event.latLng,
                title: '#' + 'path.getLength()',
                map: this.map
            });
        }
        /*
    
        google.maps.event.addListener(this.map, "click", function(event) {
          alert(event.latLng);
          });
    
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          let marker = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            title: 'Hello World!'
          });
          mapEle.classList.add('show-map');
        });
        */
    };
    MapaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-mapa',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\mapa\mapa.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar color="primary">\n\n    <button ion-button menuToggle="menuMain">\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>  \n\n    \n\n    <ion-title>\n\n      Ubicación\n\n    </ion-title>\n\n\n\n    <ion-fab top right >\n\n      <button (click)="closePage()" ion-fab mini ><ion-icon name="arrow-round-up"></ion-icon></button>\n\n    </ion-fab>          \n\n\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Ubicación</b></p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button (click)="closePage()" style="background-color:#2a4a7c;"><ion-icon name="arrow-round-up" style="color: white;font-size: 30px;margin-top:10px;"></ion-icon></button>\n\n        <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n  </ion-row>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <br />\n\n  <div #map id="map"></div>\n\n\n\n  <ion-row>\n\n    <ion-col col-2></ion-col>\n\n    <ion-col col-8>\n\n      <ion-item>\n\n        <ion-label stacked>Ubicación del caso</ion-label>\n\n        <ion-textarea placeholder="Ubicación del caso" name="descripcion" [(ngModel)]="item.address" readonly color="ligth"></ion-textarea>\n\n      </ion-item>        \n\n    </ion-col>\n\n    <ion-col col-2></ion-col>\n\n  </ion-row>\n\n \n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\mapa\mapa.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], MapaPage);
    return MapaPage;
}());

//# sourceMappingURL=mapa.js.map

/***/ }),

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CasoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__casos_casos__ = __webpack_require__(49);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CasoPage = /** @class */ (function () {
    function CasoPage(servicioFirebase, nav, navParams, alertCtrl, app) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.app = app;
        this.coleccion = "caso";
        this.isUpdate = false;
        this.createSuccess = false;
        this.doc = { id: '', idObservador: '', delta: { usuario: "" } };
        this.forma = { dateCreation: '' };
        //url="https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Faccidente.jpg?alt=media&token=abf0dad0-e73c-464c-a1d6-7554cc4969d9";
        this.modelo = { categoria: "" };
        if (navParams.data) {
            this.isUpdate = true;
            this.doc = navParams.data;
        }
        else if (navParams.get('item')) {
            this.isUpdate = true;
            this.doc = navParams.get('item');
            //this.doc['dateCreation']=this.doc['dateCreation'].toDate();
        }
        this.doc['delta'] = { usuario: "" };
        console.log("caso", this.doc);
    }
    CasoPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad Page', this.doc.idObservador);
        this.servicioFirebase.docById("usuarios/" + this.doc.idObservador)
            .then(function (snapshot) { return _this.doc.delta.usuario = snapshot.usuario; });
        this.setCategoria(this.doc["idClassification"]);
    };
    CasoPage.prototype.closePage = function () {
        //this.nav.setRoot(CasosPage);
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__casos_casos__["a" /* CasosPage */]);
    };
    CasoPage.prototype.register = function () {
        {
            this.servicioFirebase.agregarDocumento(this.coleccion, this.doc);
            this.showPopup("Casos", "Documento creado");
        }
    };
    CasoPage.prototype.editar = function () {
        if (this.doc["estatus"] == "Terminado" || this.doc["estatus"] == "Cancelado") {
            this.doc['dateClosed'] = new Date().toISOString();
        }
        this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, this.doc);
        this.showPopup("Casos", "Documento actualizado");
    };
    CasoPage.prototype.borrar = function () {
        this.servicioFirebase.eliminarDocumento(this.coleccion, this.doc.id);
        this.showPopup("Casos", "Documento Borrado");
    };
    CasoPage.prototype.showImagen = function () {
        this.nav.parent.select(1);
        /*
            document.getElementById('idMarco').hidden = false;
            var imagen = document.createElement("img");
            console.log("Img",imagen);
            imagen.src=this.url;
            var marco = document.getElementById("marco");
            marco.appendChild(imagen);
        */
    };
    CasoPage.prototype.salir = function () {
        //this.nav.pop();
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_3__casos_casos__["a" /* CasosPage */]);
    };
    CasoPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    CasoPage.prototype.setCategoria = function (ref) {
        var _this = this;
        //console.log("getCategoria",ref)
        if (!ref || ref.indexOf("clases/") < 0) {
            this.modelo.categoria = ref;
            return;
        }
        var idx = ref.split("clases/");
        var categoria = this.servicioFirebase.model["clases"][idx[0]]["clase"];
        //console.log("Categoria",categoria)
        if (idx[1]) {
            this.servicioFirebase.docById(ref)
                .then(function (doc) { _this.modelo.categoria = categoria + "/" + doc.clase; });
        }
        else {
            this.modelo.categoria = categoria;
        }
    };
    CasoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-caso',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\caso\caso.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle="menuMain">\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>      \n\n    <ion-title>Detalle del Caso</ion-title>\n\n    <ion-fab top right>\n\n      <button (click)="closePage()" ion-fab mini ><ion-icon name="arrow-round-up"></ion-icon></button>\n\n    </ion-fab>          \n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Detalle del Caso</b></p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button (click)="closePage()" style="background-color:#2a4a7c;"><ion-icon name="arrow-round-up" style="color: white;font-size: 30px;margin-top:10px;"></ion-icon></button>\n\n        <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n  \n\n<ion-content padding class="tema-app">\n\n    <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n    </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n  \n\n  <form (ngSubmit)="editar()" #registerForm="ngForm" >\n\n      <ion-row>\n\n        <ion-col>\n\n          <ion-list inset>\n\n              <ion-item>\n\n                <ion-label stacked>Folio</ion-label>\n\n                <ion-input type="text" name="idCase" [(ngModel)]="doc.idCase" readonly></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                <ion-label stacked>Caso</ion-label>\n\n                <ion-input type="text" name="titulo" [(ngModel)]="doc.titulo" readonly></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                <ion-label stacked>Riesgo</ion-label>\n\n                <ion-input type="text" name="riesgo" [(ngModel)]="doc.riesgo" readonly></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                <ion-label stacked>Impacto</ion-label>\n\n                <ion-input type="text" name="impacto" [(ngModel)]="doc.impacto" readonly></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                  <ion-label stacked>Fecha y hora</ion-label>\n\n                  <ion-input type="text" name="fecha" value="{{ doc.dateCreation | date:\'dd-MM-yyyy HH:mm:ss\' }}" readonly></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                  <ion-label stacked>Categoría</ion-label>\n\n                  <label>Categoría</label>\n\n                <ion-input type="text" name="clasificacion" [(ngModel)]="modelo.categoria" readonly></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                  <ion-label stacked>Municipio</ion-label>\n\n                  <label>Municipio</label>\n\n                <ion-input type="text" name="municipio" [(ngModel)]="doc.municipio" readonly></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                  <ion-label stacked>Descripción</ion-label>\n\n                  <ion-textarea name="descripcion" [(ngModel)]="doc.description" readonly color="light"></ion-textarea>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                  <ion-label stacked>Dirección</ion-label>\n\n                  <ion-textarea name="direccion" [(ngModel)]="doc.address" readonly></ion-textarea>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                  <ion-label stacked>Observador</ion-label>\n\n                  <ion-input type="text" name="observador" [(ngModel)]="doc.delta.usuario" readonly></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                <ion-label stacked>Estatus</ion-label>\n\n                <ion-select name="Estatus" [(ngModel)]="doc.estatus" required>\n\n                  <ion-option>Activo</ion-option>\n\n                  <ion-option>Terminado</ion-option>\n\n                  <ion-option>Cancelado</ion-option>\n\n                </ion-select>\n\n              </ion-item>    \n\n          </ion-list>\n\n        </ion-col>\n\n      </ion-row>\n\n      <button ion-button class="submit-btn loginButton round" full type="submit" [disabled]="!registerForm.form.valid">Guardar</button>\n\n\n\n      <!--\n\n      <ion-row>\n\n        <ion-col class="ion-col" *ngIf="!isUpdate">\n\n          <button ion-button class="submit-btn" full type="submit"  [disabled]="!registerForm.form.valid">Register</button>\n\n        </ion-col>\n\n        <ion-col class="ion-col" *ngIf="!isUpdate">\n\n          <button ion-button class="submit-btn" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n        </ion-col>\n\n        <ion-col class="ion-col" *ngIf="!isUpdate">\n\n          <button ion-button class="submit-btn" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n        </ion-col>\n\n        <ion-col class="ion-col" *ngIf="isUpdate">\n\n            <button ion-button class="submit-btn" full type="button"  (click)="showImagen()" [disabled]="!registerForm.form.valid">  Ver Evidencias &nbsp;<ion-thumbnail><ion-img [src]="url"></ion-img></ion-thumbnail>\n\n\n\n            </button>\n\n          </ion-col>\n\n        <ion-col class="ion-col" *ngIf="isUpdate">\n\n            <button ion-button class="submit-btn" full type="button"  (click)="salir()" [disabled]="!registerForm.form.valid">  Salir&nbsp;<ion-icon name="arrow-round-up"></ion-icon></button>\n\n        </ion-col>\n\n        </ion-row>\n\n      -->        \n\n    </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>       \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\caso\caso.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */]])
    ], CasoPage);
    return CasoPage;
}());

//# sourceMappingURL=caso.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return evidenciasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__casos_casos__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__evidencia_evidencia__ = __webpack_require__(258);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var evidenciasPage = /** @class */ (function () {
    function evidenciasPage(app, navCtrl, navParams, servicioFirebase) {
        this.app = app;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.coleccion = "caso/";
    }
    ;
    evidenciasPage.prototype.ionViewDidLoad = function () {
        this.item = this.navParams.data;
        this.coleccion += this.item.id + "/evidencias";
        this.servicioFirebase.consultarColeccion(this.coleccion);
        console.log(this.coleccion);
    };
    evidenciasPage.prototype.selectRow = function (event, item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__evidencia_evidencia__["a" /* evidenciaPage */], {
            item: item
        });
    };
    evidenciasPage.prototype.closePage = function () {
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__casos_casos__["a" /* CasosPage */]);
    };
    evidenciasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-evidencias',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\evidencias\evidencias.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle="menuMain">\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>  \n\n    <ion-title>Evidencias</ion-title>\n\n    <ion-fab top right >\n\n      <button (click)="closePage()" ion-fab mini ><ion-icon name="arrow-round-up"></ion-icon></button>\n\n    </ion-fab>          \n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Evidencias</b></p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button (click)="closePage()" style="background-color:#2a4a7c;"><ion-icon name="arrow-round-up" style="color: white;font-size: 30px;margin-top:10px;"></ion-icon></button>\n\n        <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n\n\n<ion-content padding class="tema-app">\n\n  <!-- -->\n\n  <div *ngIf="this.servicioFirebase.modelo[\'evidencias\'] == 0">\n\n    <ion-item>No hay evidencias.</ion-item>\n\n  </div>\n\n  <!-- --> \n\n  <ion-grid>\n\n    <ion-row no-padding class="hdr">\n\n      <ion-col class="ion-text-center">\n\n        <h6 style="text-align:center;">Galería</h6>\n\n      </ion-col>\n\n    </ion-row>\n\n    <div *ngFor="let item of this.servicioFirebase.modelo[coleccion];even as isEven" (click)="selectRow($event, item)" text-wrap>\n\n      <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'">\n\n        <ion-col col-2></ion-col>            \n\n        <ion-col col-8>              \n\n          <ion-card *ngIf="item.tipo==\'imagen\'">\n\n            <ion-card-header>\n\n              Fotografia\n\n            </ion-card-header>\n\n            <ion-card-content>\n\n              <div height=\'360\' width=\'480\' class="ion-text-center">\n\n                <img [src]="item.urlPhoto"  height=\'360\' width=\'480\' />\n\n              </div>\n\n            </ion-card-content>\n\n          </ion-card>\n\n          <ion-card *ngIf="item.tipo==\'video\'"> \n\n            <ion-card-header>\n\n              Video\n\n            </ion-card-header>\n\n            <ion-card-content>\n\n              <video controls="controls"  height=\'360\' width=\'480\' preload="metadata" webkit-playsinline="webkit-playsinline" class="videoPlayer">\n\n                <source [src]="item.urlPhoto" type="video/mp4" />\n\n              </video>\n\n            </ion-card-content>\n\n          </ion-card>    \n\n          \n\n        </ion-col>       \n\n        <ion-col col-1>\n\n          {{item.tipo}}\n\n        </ion-col>\n\n        <ion-col col-1></ion-col>            \n\n      </ion-row>\n\n    </div>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\evidencias\evidencias.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], evidenciasPage);
    return evidenciasPage;
}());

//# sourceMappingURL=evidencias.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return evidenciaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var evidenciaPage = /** @class */ (function () {
    function evidenciaPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.coleccion = "evidencias";
        this.isUpdate = false;
        this.createSuccess = false;
        this.forma = { id: '', confirmation_password: '' };
        this.doc = { id: "", pass: "" };
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.doc = navParams.get('item');
            this.forma.confirmation_password = this.doc.pass;
        }
        console.info("evidencia", this.doc);
    }
    evidenciaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad evidenciaPage');
    };
    evidenciaPage.prototype.register = function () {
        var _this = this;
        //Validar
        if (this.doc.pass != this.forma.confirmation_password) {
            this.showPopup("Error", 'The password confirmation does not match.');
        }
        else if (this.file) {
            this.servicioFirebase.fileUpload(this.file).then(function (fileInfo) {
                _this.doc["foto"] = fileInfo.downloadUrl;
                _this.servicioFirebase.agregarDocumento("evidencias", _this.doc);
                _this.showPopup("Success", "Document created.");
            });
        }
        else {
            this.servicioFirebase.agregarDocumento("evidencias", this.doc);
            this.showPopup("Success", "Document created.");
        }
    };
    evidenciaPage.prototype.editar = function () {
        var _this = this;
        if (this.file) {
            this.servicioFirebase.fileUpload(this.file).then(function (fileInfo) {
                _this.doc["foto"] = fileInfo.downloadUrl;
                _this.servicioFirebase.editarDocumento(_this.coleccion, _this.doc.id, _this.doc);
                _this.showPopup("Success", "Document updated.");
            });
        }
        else {
            this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, this.doc);
            this.showPopup("Success", "Document updated.");
        }
    };
    evidenciaPage.prototype.borrar = function () {
        this.servicioFirebase.eliminarDocumento(this.coleccion, this.doc.id);
        this.showPopup("Success", "Document delete.");
    };
    evidenciaPage.prototype.setFile = function (event) {
        this.file = event.target.files[0];
        console.log("File:", this.file);
    };
    evidenciaPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    evidenciaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-evidencia',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\evidencia\evidencia.html"*/'<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>Evidencia</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n<ion-content padding >\n\n  <form (ngSubmit)="register()" #registerForm="ngForm">\n\n      <ion-row>\n\n        <ion-col size="4"></ion-col>\n\n        <ion-col size="5">\n\n          <ion-card *ngIf="doc.tipo==\'imagen\'">\n\n            <ion-card-header>\n\n              Fotografía\n\n            </ion-card-header>\n\n            <ion-card-content>\n\n                <ion-img [src]="doc.urlPhoto"  height=\'300\' width=\'500\'></ion-img>\n\n            </ion-card-content>\n\n          </ion-card>\n\n          <ion-card *ngIf="doc.tipo==\'video\'"> \n\n            <ion-card-header>\n\n              Video\n\n            </ion-card-header>\n\n            <ion-card-content>\n\n              <video controls="controls"  height=\'300\' width=\'500\' preload="metadata" webkit-playsinline="webkit-playsinline" class="videoPlayer">\n\n                <source [src]="doc.urlPhoto" type="video/mp4" />\n\n              </video>\n\n            </ion-card-content>\n\n          </ion-card>\n\n        </ion-col>      \n\n        <ion-col size="3">          \n\n        </ion-col>\n\n      </ion-row>\n\n    <!--\n\n      <ion-row>\n\n        <ion-col class="evidencia-col" *ngIf="!isUpdate">\n\n          <button ion-button class="submit-btn" full type="submit"  [disabled]="!registerForm.form.valid">Register</button>\n\n        </ion-col>\n\n        <ion-col class="evidencia-col" *ngIf="isUpdate">\n\n          <button ion-button class="submit-btn" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n        </ion-col>\n\n        <ion-col class="evidencia-col" *ngIf="isUpdate">\n\n          <button ion-button class="submit-btn" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n        </ion-col>\n\n      </ion-row>\n\n    -->\n\n    </form>\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\evidencia\evidencia.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], evidenciaPage);
    return evidenciaPage;
}());

//# sourceMappingURL=evidencia.js.map

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "evidenciaPageModule", function() { return evidenciaPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__evidencia__ = __webpack_require__(258);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var evidenciaPageModule = /** @class */ (function () {
    function evidenciaPageModule() {
    }
    evidenciaPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__evidencia__["a" /* evidenciaPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__evidencia__["a" /* evidenciaPage */]),
            ],
        })
    ], evidenciaPageModule);
    return evidenciaPageModule;
}());

//# sourceMappingURL=evidencia.module.js.map

/***/ }),

/***/ 260:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "evidenciasPageModule", function() { return evidenciasPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__evidencias__ = __webpack_require__(257);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var evidenciasPageModule = /** @class */ (function () {
    function evidenciasPageModule() {
    }
    evidenciasPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__evidencias__["a" /* evidenciasPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__evidencias__["a" /* evidenciasPage */]),
            ],
        })
    ], evidenciasPageModule);
    return evidenciasPageModule;
}());

//# sourceMappingURL=evidencias.module.js.map

/***/ }),

/***/ 261:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginPageModule", function() { return LoginPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login__ = __webpack_require__(137);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var LoginPageModule = /** @class */ (function () {
    function LoginPageModule() {
    }
    LoginPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */])
            ],
        })
    ], LoginPageModule);
    return LoginPageModule;
}());

//# sourceMappingURL=login.module.js.map

/***/ }),

/***/ 262:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsuarioPageModule", function() { return UsuarioPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__usuario__ = __webpack_require__(139);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var UsuarioPageModule = /** @class */ (function () {
    function UsuarioPageModule() {
    }
    UsuarioPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__usuario__["a" /* UsuarioPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__usuario__["a" /* UsuarioPage */]),
            ],
        })
    ], UsuarioPageModule);
    return UsuarioPageModule;
}());

//# sourceMappingURL=usuario.module.js.map

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsuariosPageModule", function() { return UsuariosPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__usuarios__ = __webpack_require__(264);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var UsuariosPageModule = /** @class */ (function () {
    function UsuariosPageModule() {
    }
    UsuariosPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__usuarios__["a" /* UsuariosPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__usuarios__["a" /* UsuariosPage */]),
            ],
        })
    ], UsuariosPageModule);
    return UsuariosPageModule;
}());

//# sourceMappingURL=usuarios.module.js.map

/***/ }),

/***/ 264:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsuariosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__usuario_usuario__ = __webpack_require__(139);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var UsuariosPage = /** @class */ (function () {
    function UsuariosPage(navCtrl, navParams, servicioFirebase) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.coleccion = "usuarios";
    }
    ;
    UsuariosPage.prototype.ionViewDidLoad = function () {
        this.servicioFirebase.consultarColeccion(this.coleccion);
        this.getRegiones("regiones");
    };
    UsuariosPage.prototype.selectRow = function (event, item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__usuario_usuario__["a" /* UsuarioPage */], {
            item: item
        });
    };
    UsuariosPage.prototype.getRegion = function (idRegion) {
        var coleccion = "regiones";
        if (!idRegion)
            return coleccion;
        var idx = idRegion.split("/");
        var nmRegion;
        try {
            nmRegion = this.servicioFirebase.model[coleccion][idx[1]].region + "/"
                + this.servicioFirebase.model[coleccion][idx[1]][coleccion][idx[3]].region + "/"
                + this.servicioFirebase.model[coleccion][idx[1]][coleccion][idx[3]][coleccion][idx[5]].region + "/";
        }
        catch (e) {
            nmRegion = "Region";
            //console.log("error", e)
        }
        return nmRegion;
    };
    UsuariosPage.prototype.getRegiones = function (coleccion) {
        var _this = this;
        console.log('getRegiones');
        this.servicioFirebase.getColeccion(coleccion)
            .then(function (snap1) {
            var _loop_1 = function (item) {
                var ref = coleccion + "/" + item + "/" + coleccion;
                _this.servicioFirebase.getColeccion(ref)
                    .then(function (snap2) {
                    if (!snap2)
                        return;
                    _this.servicioFirebase.model[coleccion][item][coleccion] = snap2;
                    var _loop_2 = function (item2) {
                        var ref2 = coleccion + "/" + item + "/" + coleccion + "/" + item2 + "/" + coleccion;
                        _this.servicioFirebase.getColeccion(ref2)
                            .then(function (snap3) {
                            if (!snap3)
                                return;
                            _this.servicioFirebase.model[coleccion][item][coleccion][item2][coleccion] = snap3;
                        });
                    };
                    for (var item2 in snap2) {
                        _loop_2(item2);
                    }
                });
            };
            for (var item in snap1) {
                _loop_1(item);
            }
            ;
        });
    };
    UsuariosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-usuarios',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\usuarios\usuarios.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle="menuMain">\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>  \n\n    <ion-title>Usuarios</ion-title>\n\n    <ion-fab bottom right>\n\n        <button (click)="selectRow()" ion-fab mini ><ion-icon name="add" ></ion-icon></button>\n\n    </ion-fab>      \n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-7 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Lista de Usuarios</b></p>\n\n      </ion-col>\n\n      <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n        <p style="height: 100%;width: 100%;;padding:0;">\n\n          <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n            <ion-icon\n\n              name="add-circle"\n\n              style="color: white;font-size: 40px;margin:0;"\n\n              (click)="selectRow(null, null)"\n\n            ></ion-icon>\n\n          </b>\n\n        </p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <!--<button ion-button (click)="closePage()" style="background-color:#2a4a7c;"><ion-icon name="arrow-round-up" style="color: white;font-size: 30px;margin-top:10px;"></ion-icon></button>-->\n\n        <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n  \n\n<ion-content padding class="tema-app">\n\n  <!-- -->\n\n    <div *ngIf="this.servicioFirebase.modelo[\'usuarios\'] == 0">\n\n      <ion-item>No hay usuarios.</ion-item>\n\n    </div>\n\n  <!-- -->\n\n  <ion-grid> \n\n    <h6>\n\n    <ion-row no-padding class="hdr">\n\n      <ion-col>\n\n      </ion-col>     \n\n      <ion-col>\n\n        Usuario\n\n      </ion-col>\n\n      <ion-col>\n\n        Correo\n\n      </ion-col>\n\n      <ion-col>\n\n        Roles\n\n      </ion-col>\n\n      <ion-col>\n\n        Región\n\n      </ion-col>\n\n      <ion-col>\n\n        Estatus\n\n      </ion-col>\n\n    </ion-row>\n\n    </h6>\n\n    <div *ngFor="let item of this.servicioFirebase.modelo[\'usuarios\'];even as isEven" (click)="selectRow($event, item)" text-wrap>\n\n      <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'">            \n\n        <ion-col>\n\n          <button ion-item [ngClass]="isEven? \'even\' : \'odd\'">\n\n            <ion-avatar item-start>\n\n              <img [src]="item.foto" title="Ver detalle"/>\n\n            </ion-avatar>\n\n          </button>\n\n        </ion-col>       \n\n        <ion-col>\n\n          {{ item.usuario }}\n\n        </ion-col>\n\n        <ion-col>\n\n          {{ item.correo }}\n\n        </ion-col>\n\n        <ion-col>\n\n          {{ item.roles }}\n\n        </ion-col>\n\n        <ion-col>\n\n          {{ getRegion(item.idRegion) }}\n\n        </ion-col>\n\n        <ion-col>\n\n          {{ item.estatus }}\n\n        </ion-col>\n\n      </ion-row>\n\n    </div>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\usuarios\usuarios.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], UsuariosPage);
    return UsuariosPage;
}());

//# sourceMappingURL=usuarios.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FcmService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_firebase_ngx__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_fire_firestore__ = __webpack_require__(131);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var FcmService = /** @class */ (function () {
    function FcmService(firebase, afs, platform) {
        this.firebase = firebase;
        this.afs = afs;
        this.platform = platform;
    }
    FcmService.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.platform.is('android')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.firebase.getToken()];
                    case 1:
                        token = _a.sent();
                        console.log("token.andorid", token);
                        return [3 /*break*/, 5];
                    case 2:
                        if (!this.platform.is('ios')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.firebase.getToken()];
                    case 3:
                        token = _a.sent();
                        return [4 /*yield*/, this.firebase.grantPermission()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.saveToken(token);
                        return [2 /*return*/];
                }
            });
        });
    };
    FcmService.prototype.saveToken = function (token) {
        if (!token)
            return;
        var devicesRef = this.afs.collection('devices');
        var data = {
            token: token,
            userId: 'testUserId'
        };
        return devicesRef.doc(token).set(data);
    };
    FcmService.prototype.onNotifications = function () {
        var obj = this.firebase.onNotificationOpen();
        return obj;
    };
    FcmService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_firebase_ngx__["a" /* Firebase */],
            __WEBPACK_IMPORTED_MODULE_3__angular_fire_firestore__["a" /* AngularFirestore */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Platform */]])
    ], FcmService);
    return FcmService;
}()); // End Service

//# sourceMappingURL=fcm.servicio.js.map

/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WelcomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_login__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__usuario_usuario__ = __webpack_require__(139);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var WelcomePage = /** @class */ (function () {
    function WelcomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    WelcomePage.prototype.login = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__login_login__["a" /* LoginPage */]);
    };
    WelcomePage.prototype.signup = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__usuario_usuario__["a" /* UsuarioPage */]);
    };
    WelcomePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad WelcomePage');
    };
    WelcomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-welcome',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\welcome\welcome.html"*/'<!--\n\n  Generated template for the WelcomePage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>welcome</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding id="welcome">\n\n  <img src="assets/imgs/logo.png" class="logo"/>\n\n  <ion-grid>\n\n    <ion-row>\n\n      <ion-col>\n\n        <h1>Welcome to Your App</h1>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n  <ion-grid >\n\n    <ion-row>\n\n      <ion-col center text-center>\n\n        <button ion-button full color="success" (click)="signup()">Sign up</button>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col center text-center>\n\n        <button ion-button full color="lightText" (click)="login()">Log in</button>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\welcome\welcome.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], WelcomePage);
    return WelcomePage;
}());

//# sourceMappingURL=welcome.js.map

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return menuCatalogos; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var menuCatalogos = /** @class */ (function () {
    function menuCatalogos(navCtrl, app, menuCtrl) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.menuCtrl = menuCtrl;
        menuCtrl.enable(true, 'menuCatalogos');
    }
    menuCatalogos.prototype.logout = function () {
        // Remove API token 
        var root = this.app.getRootNav();
        root.popToRoot();
    };
    menuCatalogos = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-menuCatalogos',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\menuCatalogos\menuCatalogos.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle="menuCatalogos">\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>  \n\n    <ion-title>Catálogos</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Catálogos</b></p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n    \n\n<ion-content padding class="tema-app">\n\n  <div class="login-content">\n\n    <div padding-horizontal text-center class="animated fadeInDown">\n\n      <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/logo_obser_ciu.png" alt="Observador ciudadano">\n\n      </div>\n\n      <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n      </div>\n\n    </div>\n\n  </div>    \n\n    <div padding-horizontal text-center >\n\n      <h3>Catálogos</h3>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\menuCatalogos\menuCatalogos.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */]])
    ], menuCatalogos);
    return menuCatalogos;
}());

//# sourceMappingURL=menuCatalogos.js.map

/***/ }),

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EstadosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__estado_estado__ = __webpack_require__(312);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var EstadosPage = /** @class */ (function () {
    function EstadosPage(navCtrl, navParams, servicioFirebase) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.coleccion = "regiones";
    }
    ;
    EstadosPage.prototype.ionViewDidLoad = function () {
        this.servicioFirebase.consultarColeccion(this.coleccion);
    };
    EstadosPage.prototype.selectRow = function (event, item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__estado_estado__["a" /* EstadoPage */], {
            item: item
        });
    };
    EstadosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-estados',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\estados\estados.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n      <button ion-button menuToggle="menuCatalogos">\n\n          <ion-icon name="menu"></ion-icon>\n\n      </button>  \n\n    <ion-title>Estados</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-7 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Estados</b></p>\n\n      </ion-col>\n\n      <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n        <p style="height: 100%;width: 100%;;padding:0;">\n\n          <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n            <ion-icon\n\n              name="add-circle"\n\n              style="color: white;font-size: 40px;margin:0;"\n\n              (click)="selectRow()"\n\n            ></ion-icon>\n\n          </b>\n\n        </p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding>  \n\n    <div *ngIf="servicioFirebase.modelo[coleccion] == 0">\n\n      <ion-item>No hay información</ion-item>\n\n    </div>\n\n  <!-- \n\n  <ion-fab top right>\n\n    <button (click)="selectRow()" ion-fab mini><ion-icon name="add"></ion-icon></button>\n\n  </ion-fab> \n\n  -->\n\n\n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n\n\n  <ion-grid size-lg>\n\n\n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n        <ion-row no-padding class="grad">\n\n          <ion-col text-center>\n\n            <h6>Estado</h6>\n\n          </ion-col>\n\n          <ion-col text-left>\n\n            <h6>Nombre completo del estado</h6>\n\n          </ion-col>\n\n          <ion-col col-1></ion-col>\n\n        </ion-row>\n\n      </ion-col>\n\n      <ion-col col-2 size-lg></ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>  \n\n      <ion-col col-2></ion-col>\n\n        <ion-col col-8>\n\n          <div *ngFor="let item of this.servicioFirebase.modelo[coleccion];even as isEven" (click)="selectRow($event, item)">\n\n            <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n              <ion-col text-center>\n\n                {{ item.region}}\n\n              </ion-col>\n\n              <ion-col text-left>\n\n                {{ item.nombre }}\n\n              </ion-col>\n\n              <ion-col col-1>\n\n                <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n              </ion-col>             \n\n            </ion-row>\n\n          </div>        \n\n        </ion-col>\n\n      <ion-col col-2></ion-col>\n\n    </ion-row>\n\n  </ion-grid>  \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\estados\estados.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], EstadosPage);
    return EstadosPage;
}());

//# sourceMappingURL=estados.js.map

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EstadoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EstadoPage = /** @class */ (function () {
    function EstadoPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.coleccion = "regiones";
        this.doc = { id: '' };
        this.isUpdate = false;
        this.createSuccess = false;
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.doc = navParams.get('item');
        }
        console.log("Estado", this.doc);
    }
    EstadoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
    };
    EstadoPage.prototype.register = function () {
        {
            this.servicioFirebase.agregarDocumento(this.coleccion, this.doc);
            this.showPopup("Estados", "Documento creado");
        }
    };
    EstadoPage.prototype.editar = function () {
        this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, this.doc);
        this.showPopup("Estados", "Documento actualizado");
    };
    EstadoPage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.coleccion, _this.doc.id)
                .then(function (res) {
                _this.presentAlert("Estados", "Documento borrado");
            }).catch(function (err) {
                return _this.presentAlert("Estados", "Error al borrar");
            });
            _this.nav.pop();
        });
    };
    EstadoPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    EstadoPage.prototype.presentAlert = function (title, text) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: ["Aceptar"]
        });
        alert.present();
    };
    EstadoPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    EstadoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-estado',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\estado\estado.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Estado</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title><p style="color: white; font-size: 18px;"><b>Estado</b></p></ion-title>\n\n        </ion-navbar>        \n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n<ion-grid>  \n\n  <ion-row size-lg>\n\n    <ion-col col-2 size-lg></ion-col>\n\n    <ion-col col-8 size-lg>  \n\n\n\n      <form (ngSubmit)="register()" #registerForm="ngForm"  >\n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-list inset>    \n\n                <ion-item>\n\n                    <ion-label stacked>Estado</ion-label>\n\n                    <ion-input type="text" placeholder="Abreviación del Estado" name="cvEstado" [(ngModel)]="doc.region" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Nombre oficial del Estado</ion-label>\n\n                  <ion-input type="text" placeholder="Nombre completo del Estado" name="estado" [(ngModel)]="doc.nombre" required></ion-input>\n\n                </ion-item>\n\n    \n\n              </ion-list>\n\n            </ion-col>\n\n          </ion-row>\n\n    \n\n          <ion-row>\n\n            <ion-col class="ion-col" *ngIf="!isUpdate">\n\n              <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n            </ion-col>\n\n          </ion-row>\n\n    \n\n        </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>       \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\estado\estado.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], EstadoPage);
    return EstadoPage;
}());

//# sourceMappingURL=estado.js.map

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MunicipiosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__municipio_municipio__ = __webpack_require__(314);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MunicipiosPage = /** @class */ (function () {
    function MunicipiosPage(navCtrl, navParams, servicioFirebase) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.padre = "regiones";
        this.coleccion = "regiones";
    }
    ;
    MunicipiosPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
        this.consultar();
    };
    MunicipiosPage.prototype.consultar = function () {
        var _this = this;
        console.log('Consultar');
        this.servicioFirebase.consultarColeccion(this.padre).then(function (snap1) {
            _this.servicioFirebase.modelo[_this.padre].forEach(function (element, index) {
                _this.servicioFirebase.consultarColeccion(_this.getRef(element.id)).then(function (snap2) {
                    _this.servicioFirebase.modelo[_this.padre][index][_this.coleccion] = snap2;
                });
            });
        });
    };
    MunicipiosPage.prototype.getRef = function (id) {
        var ref = this.padre + "/" + id + "/" + this.coleccion;
        //console.log("Ref");
        return ref;
    };
    MunicipiosPage.prototype.selectRow = function (event, item, idx) {
        console.log("SelectRow", item, idx);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__municipio_municipio__["a" /* MunicipioPage */], {
            item: item,
            idx: idx
        });
    };
    MunicipiosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-municipios',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\municipios\municipios.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n      <button ion-button menuToggle="menuCatalogos">\n\n          <ion-icon name="menu"></ion-icon>\n\n      </button>  \n\n    <ion-title>Municipios</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-7 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Municipios</b></p>\n\n      </ion-col>\n\n      <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n        <p style="height: 100%;width: 100%;;padding:0;">\n\n          <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n            <ion-icon\n\n              name="add-circle"\n\n              style="color: white;font-size: 40px;margin:0;"\n\n              (click)="selectRow()"\n\n            ></ion-icon>\n\n          </b>\n\n        </p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding>  \n\n      <div *ngIf="servicioFirebase.modelo[coleccion] == 0">\n\n        <ion-item>No hay información</ion-item>\n\n      </div>\n\n    <!--   \n\n    <ion-fab top right>\n\n      <button (click)="selectRow()" ion-fab mini><ion-icon name="add"></ion-icon></button>\n\n    </ion-fab> \n\n    -->\n\n  \n\n    <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n    </div>\n\n  \n\n    <ion-grid size-lg>\n\n  \n\n      <ion-row size-lg>\n\n        <ion-col col-2 size-lg></ion-col>\n\n        <ion-col col-8 size-lg>  \n\n          <ion-row no-padding class="grad">\n\n            <ion-col text-center>\n\n              <h6>Estado</h6>\n\n            </ion-col>\n\n            <ion-col text-center>\n\n              <h6>Municipio</h6>\n\n            </ion-col>\n\n            <ion-col text-left>\n\n              <h6>Nombre del municipio</h6>\n\n            </ion-col>\n\n            <ion-col col-1></ion-col>\n\n          </ion-row>\n\n        </ion-col>\n\n        <ion-col col-2 size-lg></ion-col>\n\n      </ion-row>\n\n  \n\n      <ion-row>  \n\n        <ion-col col-2></ion-col>\n\n          <ion-col col-8>\n\n            <ng-container *ngFor="let padre of servicioFirebase.modelo[padre]; let idx=index" >\n\n            <div *ngFor="let item of padre[coleccion];even as isEven" (click)="selectRow($event, item, idx)">\n\n                <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n                  <ion-col text-center>\n\n                    {{ padre.region}}\n\n                  </ion-col>\n\n                  <ion-col text-center>\n\n                    {{ item.region}}\n\n                  </ion-col>\n\n                  <ion-col text-left>\n\n                    {{ item.nombre }}\n\n                  </ion-col>\n\n                  <ion-col col-1>\n\n                      <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n                    </ion-col>             \n\n                </ion-row>\n\n            </div>\n\n            </ng-container>        \n\n          </ion-col>\n\n        <ion-col col-2></ion-col>\n\n      </ion-row>\n\n    </ion-grid>  \n\n  </ion-content>\n\n  '/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\municipios\municipios.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], MunicipiosPage);
    return MunicipiosPage;
}());

//# sourceMappingURL=municipios.js.map

/***/ }),

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MunicipioPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__maper_maper__ = __webpack_require__(162);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MunicipioPage = /** @class */ (function () {
    function MunicipioPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.padre = "regiones";
        this.itemPadre = { "id": "" };
        this.coleccion = "regiones";
        this.doc = { id: '' };
        this.isUpdate = false;
        this.createSuccess = false;
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.itemPadre = this.servicioFirebase.modelo[this.padre][navParams.get('idx')];
            this.doc = navParams.get('item');
        }
        console.log("Constructor", this.doc, this.itemPadre);
    }
    MunicipioPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
    };
    MunicipioPage.prototype.getRef = function (id) {
        var ref = this.padre + "/" + id + "/" + this.coleccion;
        //console.log("Ref");
        return ref;
    };
    MunicipioPage.prototype.register = function () {
        var _this = this;
        {
            this.servicioFirebase.agregarDocumento(this.getRef(this.itemPadre.id), this.doc)
                .then(function (res) {
                _this.consultar();
                _this.showPopup("Municipios", "Documento creado");
            }).catch(function (err) {
                return _this.showPopup("Municipios", "Error en creación");
            });
        }
    };
    MunicipioPage.prototype.editar = function () {
        var _this = this;
        this.servicioFirebase.editarDocumento(this.getRef(this.itemPadre.id), this.doc.id, this.doc)
            .then(function (res) {
            _this.showPopup("Municipios", "Documento actualizado");
        }).catch(function (err) {
            return _this.showPopup("Municipios", "Error al actualizar");
        });
    };
    MunicipioPage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.getRef(_this.itemPadre.id), _this.doc.id)
                .then(function (res) {
                _this.consultar();
                _this.showPopup("Municipios", "Documento actualizado");
            }).catch(function (err) {
                return _this.showPopup("Municipios", "Error al actualizar");
            });
            _this.nav.pop();
        });
    };
    MunicipioPage.prototype.consultar = function () {
        var _this = this;
        console.log("Consultar");
        this.servicioFirebase.consultarColeccion(this.padre).then(function (snap1) {
            _this.servicioFirebase.modelo[_this.padre].forEach(function (element, index) {
                _this.servicioFirebase.consultarColeccion(_this.getRef(element.id)).then(function (snap2) {
                    _this.servicioFirebase.modelo[_this.padre][index][_this.coleccion] = snap2;
                });
            });
        });
    };
    MunicipioPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    MunicipioPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    MunicipioPage.prototype.demarcar = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_3__maper_maper__["a" /* maperPage */], {
            item: this.doc
        });
    };
    MunicipioPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-municipio',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\municipio\municipio.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Municipio</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title><p style="color: white; font-size: 18px;"><b>Municipio</b></p></ion-title>\n\n        </ion-navbar>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n  <div padding-horizontal text-center >\n\n    <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n    \n\n        <form (ngSubmit)="register()" #registerForm="ngForm" >\n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-list inset >\n\n    <!-- -->\n\n                <ion-item>\n\n                  <ion-label>Estado</ion-label>\n\n                  <ion-select [(ngModel)]="itemPadre.id" name="idEdo" disabled="{{isUpdate}}">\n\n                    <ion-option *ngFor="let opcion of servicioFirebase.modelo[padre]" [value]="opcion.id">{{opcion.nombre}}</ion-option>                 \n\n                  </ion-select>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Municipio</ion-label>\n\n                    <ion-input type="text" placeholder="cvMunicipio" name="cvMunicipio" [(ngModel)]="doc.region" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Nombre completo del municipio</ion-label>\n\n                    <ion-input type="text" placeholder="municipio" name="municipio" [(ngModel)]="doc.nombre" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Latitud</ion-label>\n\n                    <ion-input type="number" placeholder="Latitud" name="latitud" [(ngModel)]="doc.latitude" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Longitud</ion-label>\n\n                    <ion-input type="number" placeholder="longitud" name="longitud" [(ngModel)]="doc.longitude" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Demarcación</ion-label>\n\n                    <ion-input type="text" placeholder="demarcación" name="demarcacion" [(ngModel)]="doc.demarcacion" required></ion-input>\n\n                </ion-item>\n\n\n\n              </ion-list>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n          <ion-row>\n\n            <ion-col class="ion-col" *ngIf="!isUpdate">\n\n              <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col">\n\n              <button ion-button class="round" full type="button"  (click)="demarcar()" >Demarcar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n        </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\municipio\municipio.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], MunicipioPage);
    return MunicipioPage;
}());

//# sourceMappingURL=municipio.js.map

/***/ }),

/***/ 315:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return coloniasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__colonia_colonia__ = __webpack_require__(316);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var coloniasPage = /** @class */ (function () {
    function coloniasPage(navCtrl, navParams, servicioFirebase) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.coleccion = "regiones";
        this.delta = { estado: { id: '' }, municipio: { id: '' }, idxEdo: 0, idxMun: 0 };
    }
    ;
    coloniasPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
        this.consultar(this.coleccion);
    };
    coloniasPage.prototype.consultar = function (coleccion) {
        var _this = this;
        console.log('Consultar');
        //this.servicioFirebase.consultarColecciones(coleccion);
        this.servicioFirebase.consultarColeccion(coleccion).then(function (snap1) {
            snap1.forEach(function (element, index) {
                var ref = _this.coleccion + "/" + element.id + "/" + _this.coleccion;
                _this.servicioFirebase.consultarColeccion(ref).then(function (snap2) {
                    _this.servicioFirebase.modelo[coleccion][index][coleccion] = snap2;
                    snap2.forEach(function (element2, index2) {
                        var ref2 = ref + "/" + element2.id + "/" + _this.coleccion;
                        _this.servicioFirebase.consultarColeccion(ref2).then(function (snap3) {
                            _this.servicioFirebase.modelo[coleccion][index][coleccion][index2][coleccion] = snap3;
                        });
                    });
                });
            });
        });
        //
    };
    coloniasPage.prototype.getRef = function (id) {
        var ref = this.coleccion + "/" + id + "/" + this.coleccion;
        //console.log("Ref");
        return ref;
    };
    coloniasPage.prototype.setIdxEdo = function (idxEdo) {
        this.delta.idxEdo = idxEdo;
        console.log("idx", this.delta.idxEdo);
    };
    coloniasPage.prototype.setIdxMun = function (idxMun) {
        this.delta.idxMun = idxMun;
        console.log("idx", this.delta.idxMun);
    };
    coloniasPage.prototype.selectRow = function (event, item) {
        console.log("SelectRow", item, this.delta);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__colonia_colonia__["a" /* coloniaPage */], {
            item: item,
            delta: this.delta
        });
    };
    coloniasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-colonias',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\colonias\colonias.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n      <button ion-button menuToggle="menuCatalogos">\n\n          <ion-icon name="menu"></ion-icon>\n\n      </button>  \n\n    <ion-title>Colonias</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-7 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Colonias</b></p>\n\n      </ion-col>\n\n      <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n        <p style="height: 100%;width: 100%;;padding:0;">\n\n          <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n            <ion-icon\n\n              name="add-circle"\n\n              style="color: white;font-size: 40px;margin:0;"\n\n              (click)="selectRow()"\n\n            ></ion-icon>\n\n          </b>\n\n        </p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <!--\n\n        <button ion-button (click)="closePage()" style="background-color:#2a4a7c;"><ion-icon name="house" style="color: white;font-size: 30px;margin-top:10px;"></ion-icon></button>\n\n        -->\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding>  \n\n    <div *ngIf="delta.municipio[coleccion] == 0">\n\n      <ion-item>No hay información</ion-item>\n\n    </div>\n\n    <!--  \n\n    <ion-fab top right>\n\n      <button (click)="selectRow()" ion-fab mini><ion-icon name="add"></ion-icon></button>\n\n    </ion-fab> \n\n    -->\n\n    <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n    </div>\n\n  \n\n    <ion-grid size-lg>\n\n\n\n        <ion-row size-lg>\n\n          <ion-col col-2></ion-col>\n\n          <ion-col col-8>\n\n            <ion-row>\n\n              <ion-col>\n\n                  <ion-item>\n\n                      <ion-label>Estado</ion-label>\n\n                      <ion-select [(ngModel)]="delta.estado" name="idEdo" >\n\n                        <ion-option *ngFor="let opcion of servicioFirebase.modelo[coleccion]" [value]="opcion">{{opcion.nombre}}</ion-option>                 \n\n                      </ion-select>\n\n                    </ion-item>    \n\n              </ion-col>\n\n              <ion-col>\n\n                  <ion-item>\n\n                      <ion-label>Municipio </ion-label>\n\n                      <ion-select [(ngModel)]="delta.municipio" name="idMun" >\n\n                        <ion-option *ngFor="let opcion of delta.estado[coleccion]" [value]="opcion">{{opcion.nombre}}</ion-option>                 \n\n                      </ion-select>\n\n                    </ion-item>     \n\n              </ion-col>\n\n\n\n            </ion-row>\n\n  \n\n          </ion-col>\n\n          <ion-col col-2></ion-col>\n\n        </ion-row>   \n\n  \n\n      <ion-row size-lg>\n\n        <ion-col col-2 size-lg></ion-col>\n\n        <ion-col col-8 size-lg>  \n\n          <ion-row no-padding class="grad">\n\n            <ion-col text-center>\n\n              <h6>Estado</h6>\n\n            </ion-col>\n\n            <ion-col text-center>\n\n              <h6>Colonia</h6>\n\n            </ion-col>\n\n            <ion-col text-left>\n\n              <h6>Nombre de la colonia</h6>\n\n            </ion-col>\n\n            <ion-col col-1></ion-col>\n\n          </ion-row>\n\n        </ion-col>\n\n        <ion-col col-2 size-lg></ion-col>\n\n      </ion-row>\n\n  \n\n      <ion-row>  \n\n        <ion-col col-2></ion-col>\n\n          <ion-col col-8>\n\n            <div *ngFor="let item of delta.municipio[coleccion];even as isEven" (click)="selectRow($event, item)">\n\n                <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n                  <ion-col text-center>\n\n                      {{ delta.estado.region}}/{{ delta.municipio.region}} \n\n                  </ion-col>\n\n                  <ion-col text-center>\n\n                    {{ item.region}}\n\n                  </ion-col>\n\n                  <ion-col text-left>\n\n                    {{ item.nombre }}\n\n                  </ion-col>\n\n                  <ion-col col-1>\n\n                      <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n                    </ion-col>             \n\n                </ion-row>\n\n              </div>        \n\n          </ion-col>\n\n        <ion-col col-2></ion-col>\n\n      </ion-row>\n\n    </ion-grid>  \n\n  </ion-content>\n\n  '/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\colonias\colonias.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], coloniasPage);
    return coloniasPage;
}());

//# sourceMappingURL=colonias.js.map

/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return coloniaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__maper_maper__ = __webpack_require__(162);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var coloniaPage = /** @class */ (function () {
    function coloniaPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.coleccion = "regiones";
        this.doc = { id: '' };
        this.isUpdate = false;
        this.createSuccess = false;
        this.delta = { estado: { id: '' }, municipio: { id: '' } };
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.doc = navParams.get('item');
            this.delta = navParams.get('delta');
        }
        console.log("Constructor", this.doc, this.delta);
    }
    coloniaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
        //this.consultar();
    };
    coloniaPage.prototype.consultar = function () {
        var _this = this;
        console.log("Consultar");
        var idxEdo = null, idxMun = null;
        this.servicioFirebase.modelo[this.coleccion].filter(function (element, index) {
            if (element.id == _this.delta.estado.id) {
                idxEdo = index;
                return true;
            }
        });
        this.servicioFirebase.modelo[this.coleccion][idxEdo][this.coleccion].filter(function (element, index) {
            if (element.id == _this.delta.municipio.id) {
                idxMun = index;
                return true;
            }
        });
        console.log("Edo", idxEdo, "Mun", idxMun);
        this.servicioFirebase.consultarColeccion(this.getRef()).then(function (snap) {
            _this.servicioFirebase.modelo[_this.coleccion][idxEdo][_this.coleccion][idxMun][_this.coleccion] = snap;
        });
    };
    coloniaPage.prototype.getRef = function () {
        var ref = this.coleccion + "/" + this.delta.estado.id + "/" + this.coleccion + "/" + this.delta.municipio.id + "/" + this.coleccion;
        console.log("Ref", ref);
        return ref;
    };
    coloniaPage.prototype.register = function () {
        var _this = this;
        {
            console.log("Insert", this.getRef());
            this.servicioFirebase.agregarDocumento(this.getRef(), this.doc)
                .then(function (res) {
                _this.consultar();
                _this.showPopup("Colonias", "Documento creado");
            }).catch(function (err) {
                return _this.showPopup("Colonias", "Error en creación");
            });
        }
    };
    coloniaPage.prototype.editar = function () {
        var _this = this;
        this.servicioFirebase.editarDocumento(this.getRef(), this.doc.id, this.doc)
            .then(function (res) {
            _this.showPopup("Colonias", "Documento actualizado");
        }).catch(function (err) {
            return _this.showPopup("Colonias", "Error al actualizar");
        });
    };
    coloniaPage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.getRef(), _this.doc.id)
                .then(function (res) {
                _this.consultar();
                _this.showPopup("Colonias", "Documento borrado");
            }).catch(function (err) {
                return _this.showPopup("Colonias", "Error al borrar");
            });
            _this.nav.pop();
        });
    };
    coloniaPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    coloniaPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    coloniaPage.prototype.demarcar = function () {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_3__maper_maper__["a" /* maperPage */], {
            item: this.doc
        });
    };
    coloniaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-colonia',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\colonia\colonia.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>colonia</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title><p style="color: white; font-size: 18px;"><b>Colonia</b></p></ion-title>\n\n        </ion-navbar>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n  <div padding-horizontal text-center >\n\n    <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n    \n\n        <form (ngSubmit)="register()" #registerForm="ngForm" >\n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-list inset >\n\n              <!-- -->\n\n                <ion-item>\n\n                  <ion-label>Estado</ion-label>\n\n                  <ion-select [(ngModel)]="delta.estado" name="idEdo" disabled="{{isUpdate}}" (ionChange)="this.delta.idxEdo=idxEdo">\n\n                    <ion-option *ngFor="let opcion of servicioFirebase.modelo[coleccion]; let idxEdo=index" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n                  </ion-select>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label>Municipio</ion-label>\n\n                  <ion-select [(ngModel)]="delta.municipio" name="idMun" disabled="{{isUpdate}}" (ionChange)="this.delta.idxMun=idxMun">\n\n                    <ion-option *ngFor="let opcion of delta.estado[coleccion]; let idxMun=index" [value]="opcion" >{{opcion.nombre}}</ion-option>                 \n\n                  </ion-select>\n\n                </ion-item> \n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Colonia</ion-label>\n\n                    <ion-input type="text" placeholder="cvcolonia" name="cvcolonia" [(ngModel)]="doc.region" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <!-- -->\n\n                <ion-item>\n\n                    <ion-label stacked>Nombre de la colonia</ion-label>\n\n                    <ion-input type="text" placeholder="colonia" name="colonia" [(ngModel)]="doc.nombre" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Latitud</ion-label>\n\n                    <ion-input type="number" placeholder="Latitud" name="latitud" [(ngModel)]="doc.latitude" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Longitud</ion-label>\n\n                    <ion-input type="number" placeholder="longitud" name="longitud" [(ngModel)]="doc.longitude" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Demarcación</ion-label>\n\n                    <ion-input type="text" placeholder="demarcación" name="demarcacion" [(ngModel)]="doc.demarcacion" required></ion-input>\n\n                </ion-item>\n\n\n\n              </ion-list>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n          <ion-row>\n\n            <ion-col class="ion-col" *ngIf="!isUpdate">\n\n              <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col">\n\n              <button ion-button class="round" full type="button"  (click)="demarcar()" >Demarcar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n        </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\colonia\colonia.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], coloniaPage);
    return coloniaPage;
}());

//# sourceMappingURL=colonia.js.map

/***/ }),

/***/ 317:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClasesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__clase_clase__ = __webpack_require__(318);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ClasesPage = /** @class */ (function () {
    function ClasesPage(navCtrl, navParams, servicioFirebase) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.coleccion = "clases";
    }
    ;
    ClasesPage.prototype.ionViewDidLoad = function () {
        //      this.servicioFirebase.consultarColeccion(this.coleccion);
        this.servicioFirebase.consultarColeccion(this.coleccion);
    };
    ClasesPage.prototype.selectRow = function (event, item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__clase_clase__["a" /* ClasePage */], {
            item: item
        });
    };
    ClasesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-clases',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\clases\clases.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Clasificador</ion-title>\n\n    <button ion-button right (click)="selectRow()" >\n\n      <ion-icon name="add"></ion-icon>\n\n    </button>\n\n    <button ion-button menuToggle="menuCatalogos">\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>  \n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-7 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Clasificación</b></p>\n\n      </ion-col>\n\n      <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n        <p style="height: 100%;width: 100%;;padding:0;">\n\n          <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n            <ion-icon\n\n              name="add-circle"\n\n              style="color: white;font-size: 40px;margin:0;"\n\n              (click)="selectRow()"\n\n            ></ion-icon>\n\n          </b>\n\n        </p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding>  \n\n  <!-- -->\n\n    <div *ngIf="servicioFirebase.modelo[coleccion] == 0">\n\n      <ion-item>No hay información</ion-item>\n\n    </div>\n\n  <!-- --> \n\n\n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n\n\n  <ion-grid size-lg>\n\n\n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n        <ion-row no-padding class="grad">\n\n          <ion-col text-center>\n\n            <h6>Clasificación</h6>\n\n          </ion-col>\n\n          <ion-col text-left>\n\n            <h6>Descripción</h6>\n\n          </ion-col>\n\n          <ion-col col-1></ion-col>\n\n        </ion-row>\n\n      </ion-col>\n\n      <ion-col col-2 size-lg></ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>  \n\n      <ion-col col-2></ion-col>\n\n        <ion-col col-8>\n\n          <div *ngFor="let item of this.servicioFirebase.modelo[coleccion];even as isEven" (click)="selectRow($event, item)" text-wrap>\n\n                <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n                <ion-col text-center>\n\n                  {{ item.clase}}\n\n                </ion-col>\n\n                <ion-col text-left>\n\n                  {{ item.descripcion }}\n\n                </ion-col>\n\n                <ion-col col-1>\n\n                    <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n                  </ion-col>             \n\n              </ion-row>\n\n          </div>        \n\n        </ion-col>\n\n      <ion-col col-2></ion-col>\n\n    </ion-row>\n\n  </ion-grid>  \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\clases\clases.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], ClasesPage);
    return ClasesPage;
}());

//# sourceMappingURL=clases.js.map

/***/ }),

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClasePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ClasePage = /** @class */ (function () {
    function ClasePage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.coleccion = "clases";
        this.isUpdate = false;
        this.createSuccess = false;
        this.doc = { id: '' };
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.doc = navParams.get('item');
        }
        console.log("clase", this.doc);
    }
    ClasePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
    };
    ClasePage.prototype.register = function () {
        {
            this.servicioFirebase.agregarDocumento(this.coleccion, this.doc);
            this.showPopup("Clasificación", "Documento creado");
        }
    };
    ClasePage.prototype.editar = function () {
        this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, this.doc);
        this.showPopup("Clasificación", "Documento actualizado");
    };
    ClasePage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.coleccion, _this.doc.id)
                .then(function (res) {
                _this.showPopup("Clasificación", "Documento borrado");
            }).catch(function (err) {
                return _this.showPopup("Clasificación", "Error al borrar");
            });
            _this.nav.pop();
        });
    };
    ClasePage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    ClasePage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    ClasePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-clase',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\clase\clase.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Clasificador</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title><p style="color: white; font-size: 18px;"><b>Clasificación</b></p></ion-title>\n\n        </ion-navbar>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n      \n\n        <form (ngSubmit)="register()" #registerForm="ngForm">\n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-list inset>\n\n\n\n                <ion-item>\n\n                  <ion-label stacked>Clasificación</ion-label>\n\n                  <ion-input type="text" placeholder="Clase" name="clase" [(ngModel)]="doc.clase" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Descripción</ion-label>\n\n                  <ion-input type="text" placeholder="descripción" name="descripcion" [(ngModel)]="doc.descripcion" required></ion-input>\n\n                </ion-item>\n\n                <ion-item>\n\n                  <ion-label stacked>Orden</ion-label>\n\n                  <ion-input type="number" max="99" min="0" placeholder="número de orden del ctalogo" name="orden" [(ngModel)]="doc.orden" required></ion-input>\n\n                </ion-item>\n\n\n\n              </ion-list>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n          <ion-row>\n\n            <ion-col class="ion-col" *ngIf="!isUpdate">\n\n              <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n        </form>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>       \n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\clase\clase.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ClasePage);
    return ClasePage;
}());

//# sourceMappingURL=clase.js.map

/***/ }),

/***/ 319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubClasesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__subclase_subclase__ = __webpack_require__(320);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SubClasesPage = /** @class */ (function () {
    function SubClasesPage(navCtrl, navParams, servicioFirebase) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.padre = "clases";
        this.coleccion = "clases";
    }
    ;
    SubClasesPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
        this.consultar();
    };
    SubClasesPage.prototype.consultar = function () {
        var _this = this;
        console.log('Consultar');
        this.servicioFirebase.consultarColeccion(this.padre).then(function (snap1) {
            _this.servicioFirebase.modelo[_this.padre].forEach(function (element, index) {
                _this.servicioFirebase.consultarColeccion(_this.getRef(element.id)).then(function (snap2) {
                    _this.servicioFirebase.modelo[_this.padre][index][_this.coleccion] = snap2;
                });
            });
        });
    };
    SubClasesPage.prototype.getRef = function (id) {
        var ref = this.padre + "/" + id + "/" + this.coleccion;
        //console.log("Ref");
        return ref;
    };
    SubClasesPage.prototype.selectRow = function (event, item, idx) {
        console.log("SelectRow", item, idx);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__subclase_subclase__["a" /* SubClasePage */], {
            item: item,
            idx: idx
        });
    };
    SubClasesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-subclases',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\subclases\subclases.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n      <button ion-button menuToggle="menuCatalogos">\n\n          <ion-icon name="menu"></ion-icon>\n\n      </button>  \n\n    <ion-title>subcategorias</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n  <ion-row style="background-color:#96a3b2;height: 100%;">\n\n    <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n      <div style="margin-top:5px;">\n\n        <img src="../../assets/imgs/logo1.png" alt="" />\n\n      </div>\n\n    </ion-col>\n\n    <ion-col col-7 text-center>\n\n      <p style="color: white; font-size: 18px;"><b>Subcategorías</b></p>\n\n    </ion-col>\n\n    <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n      <p style="height: 100%;width: 100%;;padding:0;">\n\n        <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n          <ion-icon\n\n            name="add-circle"\n\n            style="color: white;font-size: 40px;margin:0;"\n\n            (click)="selectRow()"\n\n          ></ion-icon>\n\n        </b>\n\n      </p>\n\n    </ion-col>\n\n    <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n      <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n        <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n      </button>  \n\n    </ion-col>\n\n  </ion-row>\n\n</ion-header>\n\n\n\n<ion-content padding>  \n\n    <div *ngIf="servicioFirebase.modelo[coleccion] == 0">\n\n      <ion-item>No hay información</ion-item>\n\n    </div>\n\n  <!--   \n\n  <ion-fab top right>\n\n    <button (click)="selectRow()" ion-fab mini><ion-icon name="add"></ion-icon></button>\n\n  </ion-fab> \n\n  -->\n\n\n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n\n\n  <ion-grid size-lg>\n\n\n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n        <ion-row no-padding class="grad">\n\n          <ion-col text-center>\n\n            <h6>Categoría</h6>\n\n          </ion-col>\n\n          <ion-col text-center>\n\n            <h6>Subcategoría</h6>\n\n          </ion-col>\n\n          <ion-col text-left>\n\n            <h6>Descripción de subcategoría</h6>\n\n          </ion-col>\n\n          <ion-col col-1></ion-col>\n\n        </ion-row>\n\n      </ion-col>\n\n      <ion-col col-2 size-lg></ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>  \n\n      <ion-col col-2></ion-col>\n\n        <ion-col col-8>\n\n          <ng-container *ngFor="let padre of servicioFirebase.modelo[padre]; let idx=index" >\n\n          <div *ngFor="let item of padre[coleccion];even as isEven" (click)="selectRow($event, item, idx)">\n\n              <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n                <ion-col text-center>\n\n                  {{ padre.clase}}\n\n                </ion-col>\n\n                <ion-col text-center>\n\n                  {{ item.clase}}\n\n                </ion-col>\n\n                <ion-col text-left>\n\n                  {{ item.nombre }}\n\n                </ion-col>\n\n                <ion-col col-1>\n\n                    <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n                  </ion-col>             \n\n              </ion-row>\n\n          </div>\n\n          </ng-container>        \n\n        </ion-col>\n\n      <ion-col col-2></ion-col>\n\n    </ion-row>\n\n  </ion-grid>  \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\subclases\subclases.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], SubClasesPage);
    return SubClasesPage;
}());

//# sourceMappingURL=subclases.js.map

/***/ }),

/***/ 320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubClasePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SubClasePage = /** @class */ (function () {
    function SubClasePage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.padre = "clases";
        this.coleccion = "clases";
        this.itemPadre = { "id": "" };
        this.doc = { id: '' };
        this.isUpdate = false;
        this.createSuccess = false;
        //
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.itemPadre = this.servicioFirebase.modelo[this.padre][navParams.get('idx')];
            this.doc = navParams.get('item');
        }
        console.log("Constructor", this.doc, this.itemPadre);
        //
    }
    SubClasePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
    };
    SubClasePage.prototype.getRef = function (id) {
        var ref = this.padre + "/" + id + "/" + this.coleccion;
        //console.log("Ref");
        return ref;
    };
    SubClasePage.prototype.register = function () {
        var _this = this;
        {
            this.servicioFirebase.agregarDocumento(this.getRef(this.itemPadre.id), this.doc)
                .then(function (res) {
                _this.consultar();
                _this.showPopup("Catalogos", "Documento creado");
            }).catch(function (err) {
                return _this.showPopup("Catalogos", "Error en creación");
            });
        }
    };
    SubClasePage.prototype.editar = function () {
        var _this = this;
        this.servicioFirebase.editarDocumento(this.getRef(this.itemPadre.id), this.doc.id, this.doc)
            .then(function (res) {
            _this.showPopup("Municipios", "Documento actualizado");
        }).catch(function (err) {
            return _this.showPopup("Municipios", "Error al actualizar");
        });
    };
    SubClasePage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.getRef(_this.itemPadre.id), _this.doc.id)
                .then(function (res) {
                _this.consultar();
                _this.showPopup("Catálogos", "Documento actualizado");
            }).catch(function (err) {
                return _this.showPopup("Catálogos", "Error al actualizar");
            });
            _this.nav.pop();
        });
    };
    SubClasePage.prototype.consultar = function () {
        var _this = this;
        console.log("Consultar");
        this.servicioFirebase.consultarColeccion(this.padre).then(function (snap1) {
            _this.servicioFirebase.modelo[_this.padre].forEach(function (element, index) {
                _this.servicioFirebase.consultarColeccion(_this.getRef(element.id)).then(function (snap2) {
                    _this.servicioFirebase.modelo[_this.padre][index][_this.coleccion] = snap2;
                });
            });
        });
    };
    SubClasePage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    SubClasePage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    SubClasePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-subclase',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\subclase\subclase.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Municipio</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title><p style="color: white; font-size: 18px;"><b>Subcategoría</b></p></ion-title>\n\n        </ion-navbar>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuCatalogos" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n  <div padding-horizontal text-center >\n\n    <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n    \n\n        <form (ngSubmit)="register()" #registerForm="ngForm" >\n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-list inset >\n\n    <!-- -->\n\n                <ion-item>\n\n                  <ion-label>Categoría</ion-label>\n\n                  <ion-select [(ngModel)]="itemPadre.id" name="idPadre" disabled="{{isUpdate}}">\n\n                    <ion-option *ngFor="let opcion of servicioFirebase.modelo[padre]" [value]="opcion.id">{{opcion.clase}}</ion-option>                 \n\n                  </ion-select>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Subcategoría</ion-label>\n\n                    <ion-input type="text" placeholder="Subcategoría" name="subcategoria" [(ngModel)]="doc.clase" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Descripción de Subcategoría</ion-label>\n\n                    <ion-input type="text" placeholder="Descripcón" name="descripcion" [(ngModel)]="doc.nombre" required></ion-input>\n\n                </ion-item>\n\n                <ion-item>\n\n                  <ion-label stacked>Orden</ion-label>\n\n                  <ion-input type="number" max="99" min="0" placeholder="número de orden del ctalogo" name="orden" [(ngModel)]="doc.orden" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n              </ion-list>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n          <ion-row>\n\n            <ion-col class="ion-col" *ngIf="!isUpdate">\n\n              <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n        </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\subclase\subclase.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], SubClasePage);
    return SubClasePage;
}());

//# sourceMappingURL=subclase.js.map

/***/ }),

/***/ 321:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return menuEncuestas; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var menuEncuestas = /** @class */ (function () {
    function menuEncuestas(navCtrl, app, menuCtrl) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.menuCtrl = menuCtrl;
        menuCtrl.enable(true, 'menuEncuestas');
    }
    menuEncuestas.prototype.logout = function () {
        // Remove API token 
        var root = this.app.getRootNav();
        root.popToRoot();
    };
    menuEncuestas = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-menuEncuestas',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\menuEncuestas\menuEncuestas.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle="menuEncuestas">\n\n        <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Encuestas</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Encuestas</b></p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuEncuestas" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n\n\n<ion-content padding class="tema-app">\n\n  <div class="login-content">\n\n    <div padding-horizontal text-center class="animated fadeInDown">\n\n      <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/logo_obser_ciu.png" alt="Observador ciudadano">\n\n      </div>\n\n      <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n      </div>\n\n    </div>\n\n  </div>    \n\n  <div padding-horizontal text-center >\n\n    <h3>Encuestas</h3>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\menuEncuestas\menuEncuestas.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */]])
    ], menuEncuestas);
    return menuEncuestas;
}());

//# sourceMappingURL=menuEncuestas.js.map

/***/ }),

/***/ 322:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EncuestasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__encuesta_encuesta__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__preguntas_preguntas__ = __webpack_require__(163);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var EncuestasPage = /** @class */ (function () {
    function EncuestasPage(navCtrl, navParams, servicioFirebase, menuCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.menuCtrl = menuCtrl;
        this.nmColeccion = "encuestas";
        menuCtrl.enable(true, 'menuEncuestas');
        this.rollPage = navParams.get('rollPage');
        this.coleccion = (navParams.get('ref')) ? navParams.get('ref') + "/" + this.nmColeccion : this.nmColeccion;
        switch (this.rollPage) {
            case this.nmColeccion:
                this.titulo = "Encuestas";
                break;
            case "preguntas":
                this.titulo = "Preguntas: seleccione encuesta...";
                break;
            case "opciones":
                this.titulo = "Opciones: seleccione encuesta...";
                break;
            default:
                this.titulo = "Encuestas?: seleccione encuesta...";
        }
        this.servicioFirebase.modelo[this.coleccion] = [];
        console.log(this.nmColeccion, this.rollPage, this.coleccion);
    }
    ;
    EncuestasPage.prototype.ionViewDidLoad = function () {
        this.servicioFirebase.consultarColeccion(this.coleccion);
    };
    EncuestasPage.prototype.selectRow = function (event, item) {
        var ref = this.coleccion;
        if (item) {
            ref = this.coleccion + "/" + item.id;
            //item.item=this.item;
        }
        else {
            item = { id: '' }; //,item:this.item};
        }
        switch (this.rollPage) {
            case this.nmColeccion:
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__encuesta_encuesta__["a" /* EncuestaPage */], { rollPage: this.rollPage, ref: this.coleccion, item: item });
                break;
            default:
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__preguntas_preguntas__["a" /* PreguntasPage */], { rollPage: this.rollPage, ref: ref, item: item });
        }
    };
    EncuestasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-encuestas',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\encuestas\encuestas.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n      <button ion-button menuToggle="menuEncuestas">\n\n          <ion-icon name="menu"></ion-icon>\n\n      </button>  \n\n    <ion-title>{{titulo}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center *ngIf="rollPage!=\'encuestas\'">\n\n        <p style="color: white; font-size: 18px;"><b>{{titulo}}</b></p>\n\n      </ion-col>\n\n      <ion-col col-7 text-center *ngIf="rollPage==\'encuestas\'">\n\n        <p style="color: white; font-size: 18px;"><b>{{titulo}}</b></p>\n\n      </ion-col>\n\n      <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" *ngIf="rollPage==\'encuestas\'">\n\n        <p style="height: 100%;width: 100%;;padding:0;">\n\n          <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n            <ion-icon\n\n              name="add-circle"\n\n              style="color: white;font-size: 40px;margin:0;"\n\n              (click)="selectRow(null, null)"\n\n            ></ion-icon>\n\n          </b>\n\n        </p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuEncuestas" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding>  \n\n  <!-- -->\n\n    <div *ngIf="servicioFirebase.modelo[coleccion] == 0">\n\n      <ion-item>No hay información</ion-item>\n\n    </div>\n\n  <!-- --> \n\n\n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n\n\n<ion-grid size-lg>\n\n  <ion-row size-lg>\n\n    <ion-col col-2 size-lg></ion-col>\n\n    <ion-col col-8 size-lg>  \n\n      <ion-row no-padding class="grad">\n\n        <ion-col text-center>\n\n          <h6>Encuesta</h6>\n\n        </ion-col>\n\n        <ion-col text-left>\n\n          <h6>Propósito</h6>\n\n        </ion-col>\n\n        <ion-col text-left>\n\n          <h6>Clasificación</h6>\n\n        </ion-col>\n\n        <ion-col col-1></ion-col>\n\n      </ion-row>\n\n    </ion-col>\n\n    <ion-col col-2 size-lg></ion-col>\n\n  </ion-row>\n\n\n\n  <ion-row>  \n\n    <ion-col col-2></ion-col>\n\n      <ion-col col-8>\n\n        <div *ngFor="let item of this.servicioFirebase.modelo[coleccion];even as isEven" (click)="selectRow($event, item)" text-wrap>\n\n            <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n              <ion-col text-center>\n\n                {{ item.encuesta}}\n\n              </ion-col>\n\n              <ion-col text-left>\n\n                {{ item.proposito }}\n\n              </ion-col>\n\n              <ion-col text-left>\n\n                {{ item.clasificacion }}\n\n              </ion-col>\n\n              <ion-col col-1>\n\n                  <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n                </ion-col>             \n\n            </ion-row>\n\n        </div>        \n\n      </ion-col>\n\n    <ion-col col-2></ion-col>\n\n  </ion-row>\n\n</ion-grid>  \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\encuestas\encuestas.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */]])
    ], EncuestasPage);
    return EncuestasPage;
}());

//# sourceMappingURL=encuestas.js.map

/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EncuestaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EncuestaPage = /** @class */ (function () {
    function EncuestaPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.coleccion = "encuestas";
        this.isUpdate = false;
        this.createSuccess = false;
        this.doc = { id: '' };
        this.doc = navParams.get('item');
        this.isUpdate = this.doc.id != '';
        console.log("encuesta", this.doc);
    }
    EncuestaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
    };
    EncuestaPage.prototype.register = function () {
        var _this = this;
        {
            this.servicioFirebase.agregarDocumento(this.coleccion, this.doc)
                .then(function (res) {
                _this.registrarEncuesta(res["id"]);
                _this.showPopup("Encuestas", "Documento creado");
            }).catch(function (err) {
                return _this.showPopup("Encuestas", "Error en creación");
            });
        }
    };
    EncuestaPage.prototype.editar = function () {
        var _this = this;
        this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, this.doc)
            .then(function (res) {
            _this.registrarEncuesta(_this.doc.id);
            _this.showPopup("Encuestas", "Documento actualizado");
        }).catch(function (err) {
            return _this.showPopup("Encuestas", "Error al actualizar");
        });
    };
    EncuestaPage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.coleccion, _this.doc.id)
                .then(function (res) {
                _this.showPopup("Encuestas", "Documento borrado");
            }).catch(function (err) {
                return _this.showPopup("Encuestas", "Error al borrar");
            });
            _this.nav.pop();
        });
    };
    EncuestaPage.prototype.registrarEncuesta = function (id) {
        //if (!this.isUpdate) {
        this.doc["idInstancia"] = this.servicioFirebase.getId();
        //}
        console.log("Instancia", id, this.doc["idInstancia"]);
        var encuesta = { idRegion: "", idCaso: "", fhInicio: new Date().toISOString(), fhFin: new Date().toISOString() };
        this.servicioFirebase.upsertDocument("encuestas/" + id + "/instancias", this.doc["idInstancia"], encuesta);
    };
    EncuestaPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    EncuestaPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        //            console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        //            console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    EncuestaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-encuesta',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\encuesta\encuesta.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Encuesta</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title>Encuesta</ion-title>\n\n        </ion-navbar>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-menu menuToggle="menuEncuestas" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n    <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n    </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n  \n\n        <form (ngSubmit)="register()" #registerForm="ngForm">\n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-list inset>\n\n                <ion-item>\n\n                  <ion-label stacked>Encuesta</ion-label>\n\n                  <ion-input type="text" placeholder="Nombre de encuesta" name="encuesta" [(ngModel)]="doc.encuesta" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Descripción</ion-label>\n\n                  <ion-input type="text" placeholder="Descripción" name="descripcion" [(ngModel)]="doc.descripcion" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Clasificación</ion-label>\n\n                  <ion-input type="text" placeholder="Clasificación" name="clasificacion" [(ngModel)]="doc.clasificacion" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Propósito</ion-label>\n\n                  <ion-input type="text" placeholder="Propósito" name="proposito" [(ngModel)]="doc.proposito" required></ion-input>\n\n                </ion-item>\n\n                <br />      \n\n                <ion-item>\n\n                  <ion-label stacked>Estatus</ion-label>\n\n                  <ion-select name="Estatus" [(ngModel)]="doc.estatus" required>\n\n                    <ion-option>Activo</ion-option>\n\n                    <ion-option>Captura</ion-option>\n\n                    <ion-option>Suspendido</ion-option>\n\n                  </ion-select>  \n\n                </ion-item>\n\n              </ion-list>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n          <ion-row>\n\n            <ion-col class="ion-col" *ngIf="!isUpdate">\n\n              <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n        </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>       \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\encuesta\encuesta.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], EncuestaPage);
    return EncuestaPage;
}());

//# sourceMappingURL=encuesta.js.map

/***/ }),

/***/ 324:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PreguntaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PreguntaPage = /** @class */ (function () {
    function PreguntaPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.nmColeccion = "preguntas";
        this.isUpdate = false;
        this.createSuccess = false;
        this.doc = { id: '' };
        this.coleccion = navParams.get('ref') ? navParams.get('ref') : this.nmColeccion;
        this.padre = this.getPadre(this.coleccion);
        this.doc = navParams.get('item');
        this.isUpdate = this.doc.id != '';
        console.log(this.coleccion, this.doc);
    }
    PreguntaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
    };
    PreguntaPage.prototype.getPadre = function (cadena) {
        return cadena.substring(0, cadena.indexOf('/'));
    };
    PreguntaPage.prototype.register = function () {
        var _this = this;
        {
            var objeto = Object.assign({}, this.doc);
            delete objeto.item;
            this.servicioFirebase.agregarDocumento(this.coleccion, objeto)
                .then(function (res) {
                //this.consultar();
                _this.showPopup("Preguntas", "Documento creado");
            }).catch(function (err) {
                console.log(err);
                _this.showPopup("Preguntas", "Error en creación");
            });
        }
    };
    PreguntaPage.prototype.editar = function () {
        var _this = this;
        var objeto = Object.assign({}, this.doc);
        delete objeto.item;
        this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, objeto)
            .then(function (res) {
            _this.showPopup("Preguntas", "Documento actualizado");
        }).catch(function (err) {
            console.log(err);
            _this.showPopup("Preguntas", "Error al actualizar");
        });
    };
    PreguntaPage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.coleccion, _this.doc.id)
                .then(function (res) {
                //this.consultar();
                _this.showPopup("Preguntas", "Documento borrado");
            }).catch(function (err) {
                return _this.showPopup("Preguntas", "Error al borrar");
            });
            _this.nav.pop();
        });
    };
    PreguntaPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    PreguntaPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        //console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        //console.log('Ok clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    PreguntaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-pregunta',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\pregunta\pregunta.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Pregunta</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title><p style="color: white; font-size: 18px;"><b>Pregunta</b></p></ion-title>\n\n        </ion-navbar>    \n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuEncuestas" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n    <div padding-horizontal text-center >\n\n        <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n    </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n  \n\n      <form (ngSubmit)="register()" #registerForm="ngForm">\n\n          <h4>{{doc.item.encuesta}}</h4>  \n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-list inset>\n\n                <ion-item>\n\n                  <ion-label stacked>Clave/Inciso/Número</ion-label>\n\n                  <ion-input type="text" placeholder="Número o inciso de pregunta" name="cvPregunta" [(ngModel)]="doc.cvPregunta" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Pregunta</ion-label>\n\n                  <ion-input type="text" placeholder="Pregunta" name="pregunta" [(ngModel)]="doc.pregunta" required></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Grupo</ion-label>\n\n                  <ion-input type="text" placeholder="Grupo" name="grupo" [(ngModel)]="doc.grupo" required></ion-input>\n\n                </ion-item>  \n\n                <br />\n\n                <ion-item>\n\n                  <ion-label>Tipo de pregunta</ion-label>\n\n                  <ion-select name="Tipo" [(ngModel)]="doc.tipo">\n\n                    <ion-option>abierta</ion-option>\n\n                    <ion-option>cerrada</ion-option>\n\n                    <ion-option>multiple</ion-option>\n\n                  </ion-select>\n\n                </ion-item>\n\n    \n\n              </ion-list>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n          <ion-row>\n\n            <ion-col class="ion-col" *ngIf="!isUpdate">\n\n              <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n        </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>       \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\pregunta\pregunta.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], PreguntaPage);
    return PreguntaPage;
}());

//# sourceMappingURL=pregunta.js.map

/***/ }),

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpcionPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var OpcionPage = /** @class */ (function () {
    function OpcionPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.nmColeccion = "opciones";
        this.isUpdate = false;
        this.createSuccess = false;
        this.doc = { id: '' };
        this.coleccion = navParams.get('ref') ? navParams.get('ref') : this.nmColeccion;
        this.padre = this.getPadre(this.coleccion);
        this.doc = navParams.get('item');
        this.isUpdate = this.doc.id != '';
        console.log(this.coleccion, this.doc);
    }
    OpcionPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
    };
    OpcionPage.prototype.getPadre = function (cadena) {
        return cadena.substring(0, cadena.indexOf('/'));
    };
    OpcionPage.prototype.register = function () {
        var _this = this;
        {
            var objeto = Object.assign({}, this.doc);
            delete objeto.item;
            this.servicioFirebase.agregarDocumento(this.coleccion, objeto)
                .then(function (res) {
                //this.consultar();
                _this.showPopup("Opciones", "Documento creado");
            }).catch(function (err) {
                console.log(err);
                _this.showPopup("Opciones", "Error al crear documento");
            });
        }
    };
    OpcionPage.prototype.editar = function () {
        var _this = this;
        var objeto = Object.assign({}, this.doc);
        delete objeto.item;
        this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, objeto)
            .then(function (res) {
            _this.showPopup("Opciones", "Documento actualizado");
        }).catch(function (err) {
            console.log(err);
            _this.showPopup("Opciones", "Error al actualizar");
        });
    };
    OpcionPage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.coleccion, _this.doc.id)
                .then(function (res) {
                //this.consultar();
                _this.showPopup("Opciones", "Documento borrado");
            }).catch(function (err) {
                return _this.showPopup("Opciones", "Error al borrar");
            });
            _this.nav.pop();
        });
    };
    OpcionPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    OpcionPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        //console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        //console.log('Ok clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    OpcionPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-opcion',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\opcion\opcion.html"*/'<!--\n\n<ion-header>\n\n    <ion-navbar>\n\n      <ion-title>Opción</ion-title>\n\n    </ion-navbar>  \n\n</ion-header>\n\n-->\n\n  <ion-header>\n\n      <ion-row style="background-color:#96a3b2;height: 100%;">\n\n        <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n          <div style="margin-top:5px;">\n\n            <img src="../../assets/imgs/logo1.png" alt="" />\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-8 text-center>\n\n          <ion-navbar color="navcolor">\n\n            <ion-title><p style="color: white; font-size: 18px;"><b>Opción</b></p>\n\n            </ion-title>\n\n          </ion-navbar>      \n\n        </ion-col>\n\n        <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n          <button ion-button menuToggle="menuEncuestas" style="background-color:#2a4a7c;text-align: center;">\n\n            <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n          </button>  \n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-header>\n\n  \n\n  <ion-content padding class="tema-app">\n\n      <div padding-horizontal text-center >\n\n          <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n      </div>\n\n    <ion-grid>  \n\n      <ion-row size-lg>\n\n        <ion-col col-2 size-lg></ion-col>\n\n        <ion-col col-8 size-lg>  \n\n\n\n        <form (ngSubmit)="register()" #registerForm="ngForm">\n\n        <h4>{{doc.item.item.encuesta}}</h4>  \n\n        <h5>Pregunta: {{doc.item.pregunta}}</h5>  \n\n        <ion-row>\n\n          <ion-col>\n\n            <ion-list inset>\n\n              <ion-item>\n\n                <ion-label stacked>Clave/Inciso/Número</ion-label>\n\n                <ion-input type="text" placeholder="Clave, inciso, número" name="clave" [(ngModel)]="doc.cvOpcion" required></ion-input>\n\n              </ion-item>\n\n              <br />\n\n              <ion-item>\n\n                <ion-label stacked>Opción</ion-label>\n\n                <ion-input type="text" placeholder="Opcion" name="opcion" [(ngModel)]="doc.opcion" required></ion-input>\n\n              </ion-item> \n\n              <br /> \n\n              <ion-item>\n\n                <ion-label stacked>Valor</ion-label>\n\n                <ion-input type="text" placeholder="Ponderación de la opcion" name="valor" [(ngModel)]="doc.valor" required></ion-input>\n\n              </ion-item>  \n\n            </ion-list>\n\n          </ion-col>\n\n        </ion-row>\n\n  \n\n        <ion-row>\n\n          <ion-col class="ion-col" *ngIf="!isUpdate">\n\n            <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n          </ion-col>\n\n          <ion-col class="ion-col" *ngIf="isUpdate">\n\n            <button ion-button class="submit-btn round" full type="button"  (click)="editar()" [disabled]="!registerForm.form.valid">Guardar</button>\n\n          </ion-col>\n\n          <ion-col class="ion-col" *ngIf="isUpdate">\n\n            <button ion-button class="submit-btn round" full type="button"  (click)="borrar()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n          </ion-col>\n\n        </ion-row>\n\n  \n\n      </form>\n\n\n\n    </ion-col>\n\n  </ion-row>\n\n</ion-grid>       \n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\opcion\opcion.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], OpcionPage);
    return OpcionPage;
}());

//# sourceMappingURL=opcion.js.map

/***/ }),

/***/ 326:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CuestionarioPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CuestionarioPage = /** @class */ (function () {
    function CuestionarioPage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.coleccion = "encuestas";
        this.doc = { id: '', instancias: {}, respuesta: {} };
        this.isUpdate = false;
        this.createSuccess = false;
        this.delta = { idObservador: "", idRegion: "", idInstancia: "", encuesta: {} };
    }
    CuestionarioPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Cuestionario');
        this.delta.idRegion = this.servicioFirebase.modelo["usuarios"][0].idRegion;
        this.delta.idObservador = this.servicioFirebase.modelo["usuarios"][0].id;
        this.servicioFirebase.getInstancias("encuestas", this.delta.idRegion);
    };
    CuestionarioPage.prototype.setIdRegion = function () {
        console.log(this.delta.encuesta);
        //    this.delta.idRegion=this.delta.encuesta["instancia"].id;
        this.consultarEncuesta();
    };
    CuestionarioPage.prototype.consultarEncuesta = function () {
        var _this = this;
        console.log('Consultar', this.delta);
        //
        var refI, refE, refP, refO;
        this.doc = { id: '', instancias: {}, respuesta: {} };
        this.delta.idInstancia = "encuestas/" + this.delta.encuesta["id"] + "/instancias/" + this.delta.encuesta["instancia"]["id"];
        refI = this.delta.idInstancia;
        this.servicioFirebase.docById(refI).then(function (docI) {
            refE = refI.substring(0, refI.indexOf('/i'));
            _this.servicioFirebase.docById(refE).then(function (docE) {
                _this.servicioFirebase.modelo[_this.coleccion] = docE;
                docE["instancias"] = docI;
                refP = refE + "/preguntas";
                _this.servicioFirebase.consultarColeccion(refP).then(function (snapP) {
                    docE["preguntas"] = snapP;
                    snapP.forEach(function (element, index) {
                        refO = refP + "/" + element.id + "/opciones";
                        _this.servicioFirebase.consultarColeccion(refO).then(function (snapO) {
                            docE["preguntas"][index]["opciones"] = snapO;
                            console.log(docE);
                            _this.doc = docE;
                        });
                    });
                });
            });
        });
        console.log("Consultar Encuesta", this.servicioFirebase.modelo[this.coleccion]);
        //
    };
    CuestionarioPage.prototype.setRespuestas = function () {
        var _this = this;
        console.log("setRespuestas", this.doc);
        var respuesta;
        var cuestionario = { idObservador: this.delta.idObservador, fecha: new Date() };
        var refC = this.delta.idInstancia + "/cuestionarios";
        this.servicioFirebase.agregarDocumento(refC, cuestionario).then(function (res) {
            cuestionario["id"] = res.id;
            console.log("Cuestionario", cuestionario);
            var refR = refC + "/" + cuestionario["id"] + "/respuestas";
            for (var _i = 0, _a = _this.doc["preguntas"]; _i < _a.length; _i++) {
                var pregunta = _a[_i];
                console.log("pregunta", pregunta);
                switch (pregunta.tipo) {
                    case "cerrada":
                        respuesta = { idPregunta: pregunta.id, respuesta: pregunta.respuesta };
                        _this.register(refR, respuesta);
                        console.log("cerrada", pregunta, pregunta.respuesta);
                        break;
                    case "multiple":
                        console.log("multiple", pregunta.opciones);
                        for (var _b = 0, _c = pregunta.opciones; _b < _c.length; _b++) {
                            var opcion = _c[_b];
                            if (opcion.isChecked) {
                                respuesta = { idPregunta: pregunta.id, idOpcion: opcion.id, respuesta: opcion.valor };
                                _this.register(refR, respuesta);
                                console.log("Respuesta", opcion.valor);
                            }
                        }
                        break;
                    default://abierta
                        respuesta = { idPregunta: pregunta.id, respuesta: pregunta.respuesta };
                        _this.register(refR, respuesta);
                        console.log("abierta", pregunta, pregunta.respuesta);
                        break;
                }
            }
            _this.showPopup("Encuestas", "Cuestionario agragado");
        });
    };
    CuestionarioPage.prototype.register = function (ref, doc) {
        var _this = this;
        {
            console.log("Insert", ref);
            this.servicioFirebase.agregarDocumento(ref, doc)
                .then(function (res) {
                console.log("idInsert;", res.id);
                doc.id = res.id;
            }).catch(function (err) {
                return _this.showPopup("Error", "Document update.");
            });
        }
    };
    CuestionarioPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    CuestionarioPage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    CuestionarioPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cuestionario',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\cuestionario\cuestionario.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle="menuEncuestas">\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>  \n\n    <ion-title>cuestionario</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <p style="color: white; font-size: 18px;"><b>Cuestionario</b></p>\n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuEncuestas" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n  <div padding-horizontal text-center >\n\n    <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n  <ion-grid>  \n\n    <ion-row size-lg>\n\n      <ion-col col-2 size-lg></ion-col>\n\n      <ion-col col-8 size-lg>  \n\n    \n\n        <form (ngSubmit)="setRespuestas()" #registerForm="ngForm" >\n\n\n\n            <ion-row>\n\n                <ion-col>\n\n                  <ion-item>\n\n                    <ion-label>Encuesta</ion-label>\n\n                    <ion-select\n\n                      [(ngModel)]="delta.encuesta"\n\n                      name="encuesta"\n\n                      (ionChange)="setIdRegion()"\n\n                    >\n\n                      <ion-option\n\n                        *ngFor="\n\n                          let opcion of servicioFirebase.modelo[\'encuestaInstancia\']\n\n                        "\n\n                        [value]="opcion"\n\n                        >{{ opcion.encuesta }}</ion-option\n\n                      >\n\n                    </ion-select>\n\n                  </ion-item>\n\n                </ion-col>\n\n              </ion-row>\n\n  <!-- empieza información de la encuesta -->\n\n          <div *ngIf="delta.encuesta[\'encuesta\']">\n\n          <br />\n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-list inset >\n\n                <br />\n\n                <ion-item>\n\n                    <ion-label stacked>Descripción</ion-label>\n\n                    <ion-input type="text" placeholder="cuestionario" name="cuestionario" [ngModel]="doc.descripcion" readonly></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Inicio encuesta</ion-label>\n\n                  <ion-input type="text" placeholder="fhInicio" name="fhInicio" [ngModel]="doc.instancias.fhInicio" readonly></ion-input>\n\n                </ion-item>\n\n                <br />\n\n                <ion-item>\n\n                  <ion-label stacked>Cierre encuesta</ion-label>\n\n                  <ion-input type="text" placeholder="fhFin" name="fhFin" [ngModel]="doc.instancias.fhFin" readonly></ion-input>\n\n                </ion-item>\n\n              </ion-list>\n\n            </ion-col>\n\n          </ion-row>\n\n        </div>\n\n        <!-- termina informacion de la encuesta -->\n\n  \n\n        <!-- empieza encuesta -->\n\n  \n\n          <ion-row>  \n\n            <ion-col col-2></ion-col>\n\n              <ion-col col-8>\n\n                <div *ngFor="let item of doc.preguntas;even as isEven;let idx=index" >\n\n                  <ion-row no-padding [ngClass]="isEven? \'even\' : \'odd\'" class="pointer">\n\n                    <ion-col col-1>\n\n                      {{ item.cvPregunta}}\n\n                    </ion-col>                    \n\n                    <ion-col text-center>\n\n                      {{ item.pregunta}}\n\n                      <ion-input type="text" placeholder="Proporciones su respuesta" name="respuesta-{{idx}}" [(ngModel)]="item.respuesta" *ngIf="item.tipo==\'abierta\'" required></ion-input>\n\n                    </ion-col>                    \n\n                  </ion-row>\n\n\n\n                  <ion-list radio-group [(ngModel)]="item.respuesta" name="respuesta-{{idx}}" *ngIf="item.tipo==\'cerrada\'" required>\n\n                    {{item.respuesta}}\n\n                    <div *ngFor="let itemOp of item.opciones;even as isEven;let idy=index;" >\n\n                      <br />\n\n                      <ion-item>\n\n                        <ion-label>{{ itemOp.cvOpcion}}</ion-label>\n\n                        <ion-label>{{ itemOp.opcion }}</ion-label>\n\n                        <ion-radio  [value]="itemOp.valor"></ion-radio>\n\n                      </ion-item>\n\n                    </div>\n\n                  </ion-list>\n\n                  \n\n                  <ion-list *ngIf="item.tipo==\'multiple\'">\n\n                    {{item.respuesta}}\n\n                    <div *ngFor="let itemOp of item.opciones;even as isEven;let idy=index;">\n\n                    <br /> \n\n                    <ion-item >\n\n                      <ion-label>{{ itemOp.cvOpcion}}</ion-label>\n\n                      <ion-label>{{itemOp.opcion}}</ion-label>\n\n                      <ion-checkbox slot="end" [(ngModel)]="itemOp.isChecked" name="respuesta-{{idx}}" required></ion-checkbox>\n\n                    </ion-item>\n\n                    </div>\n\n                  </ion-list>\n\n\n\n                </div>        \n\n              </ion-col>\n\n            <ion-col col-2></ion-col>\n\n          </ion-row>\n\n\n\n          <ion-row>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="submit"  [disabled]="!registerForm.form.valid">Guardar</button>\n\n            </ion-col>\n\n            <ion-col class="ion-col" *ngIf="isUpdate">\n\n              <button ion-button class="submit-btn round" full type="button"  (click)="setRespuestas()" [disabled]="!registerForm.form.valid">Borrar</button>\n\n            </ion-col>\n\n          </ion-row>\n\n\n\n        </form>\n\n\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\cuestionario\cuestionario.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], CuestionarioPage);
    return CuestionarioPage;
}());

//# sourceMappingURL=cuestionario.js.map

/***/ }),

/***/ 327:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return tablePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var tablePage = /** @class */ (function () {
    function tablePage(servicioFirebase, nav, navParams, alertCtrl) {
        this.servicioFirebase = servicioFirebase;
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.coleccion = "regiones";
        this.doc = { id: '' };
        this.isUpdate = false;
        this.createSuccess = false;
        if (navParams.get('item')) {
            this.isUpdate = true;
            this.doc = navParams.get('item');
        }
        console.log("table", this.doc);
    }
    tablePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Page');
    };
    tablePage.prototype.register = function () {
        {
            this.servicioFirebase.agregarDocumento(this.coleccion, this.doc);
            this.showPopup("Success", "Document created.");
        }
    };
    tablePage.prototype.editar = function () {
        this.servicioFirebase.editarDocumento(this.coleccion, this.doc.id, this.doc);
        this.showPopup("Success", "Document update.");
    };
    tablePage.prototype.borrar = function () {
        var _this = this;
        this.presentConfirm("Confirme Baja", "Se borrará el documento", function () {
            _this.servicioFirebase.eliminarDocumento(_this.coleccion, _this.doc.id)
                .then(function (res) {
                _this.presentAlert("Proceso Efectuado", "El documento se ha borrado");
            }).catch(function (err) {
                return _this.presentAlert("Error", "Error al borrado el documento ");
            });
            _this.nav.pop();
        });
    };
    tablePage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    tablePage.prototype.presentAlert = function (title, text) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: ["Aceptar"]
        });
        alert.present();
    };
    tablePage.prototype.presentConfirm = function (title, message, funcion) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: function () {
                        funcion();
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    tablePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-table',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\table\table.html"*/'<ion-header>\n\n    <ion-row style="background-color:#96a3b2;height: 100%;">\n\n      <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n        <div style="margin-top:5px;">\n\n          <img src="../../assets/imgs/logo1.png" alt="" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-8 text-center>\n\n        <ion-navbar color="navcolor">\n\n          <ion-title><p style="color: white; font-size: 18px;"><b>Tablero</b></p></ion-title>\n\n        </ion-navbar>        \n\n      </ion-col>\n\n      <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n        <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n          <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n        </button>  \n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-header>\n\n  \n\n<ion-content padding class="tema-app">    \n\n  <div padding-horizontal text-center >\n\n      <img src="../../assets/imgs/text.png" alt="Observador ciudadano">\n\n  </div>\n\n  <div width="90%"  style="height:800px;"  >\n\n      <iframe \n\n            width="100%"\n\n            style="height:800px;"\n\n            src="https://app.powerbi.com/view?r=eyJrIjoiYjE0YTI4OTAtZmI4Yy00MTAxLWFmNDEtM2E4ODVkNmI2ZjJkIiwidCI6IjkyMWY3OWM5LWYzNzUtNDcwMS04YzAwLTI1NDFhYTQzMjFhNyJ9"\n\n            frameborder="0"\n\n            webkitallowfullscreen\n\n            mozallowfullscreen\n\n            allowfullscreen          \n\n            ></iframe>\n\n    </div >\n\n</ion-content>\n\n<!--\n\n            src="https://app.powerbi.com/view?r=eyJrIjoiZDMyYTJlZjktYjBjOS00ZGI4LTkzNjYtOWE5NTg5OWY3ODY0IiwidCI6IjkyMWY3OWM5LWYzNzUtNDcwMS04YzAwLTI1NDFhYTQzMjFhNyJ9"\n\n-->\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\table\table.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], tablePage);
    return tablePage;
}());

//# sourceMappingURL=table.js.map

/***/ }),

/***/ 459:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(580);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CasosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(136);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import { ServicioDb } from '../../servicios/db.servicio';

//import { CasoPage } from '../caso/caso';

var CasosPage = /** @class */ (function () {
    function CasosPage(navCtrl, navParams, servicioFirebase
        //public servicioDb: ServicioDb
    ) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.servicioFirebase = servicioFirebase;
        this.coleccion = "caso";
        this.items = [];
        this.swFind = false;
        this.toggle = [];
    }
    ;
    CasosPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        //this.servicioDb.getColeccion(this.coleccion);
        //this.servicioFirebase.consultarColeccion(this.coleccion)
        this.servicioFirebase.getColeccion("usuarios")
            .then(function (snap) { return _this.servicioFirebase.getColeccion("clases"); })
            .then(function (snap) { return _this.servicioFirebase.findOrderCaso(_this.coleccion); })
            .then(function (snap) { return _this.items = snap; })
            .catch(function (error) { return console.log("error en lectura"); });
    };
    CasosPage.prototype.selectRow = function (event, item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */], {
            item: item
        });
    };
    CasosPage.prototype.getCategoria = function (ref) {
        if (!ref || ref.indexOf("clases/") < 0)
            return ref;
        var idx = ref.split("clases/");
        if (idx[1]) {
            return this.servicioFirebase.model["clases"][idx[1]]["clase"];
        }
        else if (idx[0]) {
            return this.servicioFirebase.model["clases"][idx[0]]["clase"];
        }
        else
            return ref;
    };
    CasosPage.prototype.setFilter = function (searchData, data) {
        var _this = this;
        this.swFind = true;
        this.items = data.filter(function (item) {
            var searchText = item.titulo + item.idClassification
                + _this.servicioFirebase.model["usuarios"][item.idObservador]["region"]
                + _this.servicioFirebase.model["usuarios"][item.idObservador]["usuario"];
            return searchText.toLowerCase().indexOf(searchData.toLowerCase()) > -1;
        });
        this.swFind = false;
    };
    CasosPage.prototype.setSort = function (item) {
        console.log(item);
        if (!this.toggle[item]) {
            this.toggle[item] = -1;
        }
        this.toggle[item] = this.toggle[item] * -1;
        var _this = this;
        if (item == "region" || item == "usuario") {
            this.items.sort(function (a, b) {
                if (_this.servicioFirebase.model["usuarios"][a.idObservador][item] > _this.servicioFirebase.model["usuarios"][b.idObservador][item]) {
                    return 1 * _this.toggle[item];
                }
                if (_this.servicioFirebase.model["usuarios"][a.idObservador][item] < _this.servicioFirebase.model["usuarios"][b.idObservador][item]) {
                    return -1 * _this.toggle[item];
                }
                // a must be equal to b
                return 0;
            });
        }
        else {
            this.items.sort(function (a, b) {
                if (a[item] > b[item]) {
                    return 1 * _this.toggle[item];
                }
                if (a[item] < b[item]) {
                    return -1 * _this.toggle[item];
                }
                // a must be equal to b
                return 0;
            });
        }
    };
    CasosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-casos',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\casos\casos.html"*/'<!--\n\n<ion-header>\n\n  <ion-navbar>\n\n      <button ion-button menuToggle="menuMain">\n\n          <ion-icon name="menu"></ion-icon>\n\n      </button>  \n\n    <ion-title>Listado de Casos</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n-->\n\n<ion-header>\n\n  <ion-row style="background-color:#96a3b2;height: 100%;">\n\n    <ion-col col-2 style="background-color: #2a4a7c;" text-center>\n\n      <div style="margin-top:5px;">\n\n        <img src="../../assets/imgs/logo1.png" alt="" />\n\n      </div>\n\n    </ion-col>\n\n    <ion-col col-7 text-center>\n\n      <p style="color: white; font-size: 18px;"><b>Listado de Casos</b></p>\n\n    </ion-col>\n\n    <ion-col col-1 style="background-color:#96a3b2;text-align: center;padding:0;" >\n\n      <!--\n\n      <p style="height: 100%;width: 100%;;padding:0;">\n\n        <b style="height: 100%;width: 100%;padding:0;" class="pointer">\n\n          <ion-icon\n\n            name="add-circle"\n\n            style="color: white;font-size: 40px;margin:0;"\n\n            (click)="selectRow(null, null)"\n\n          ></ion-icon>\n\n        </b>\n\n      </p>\n\n      -->\n\n    </ion-col>\n\n    <ion-col col-2 style="background-color:#2a4a7c;text-align: center;" >\n\n      <button ion-button menuToggle="menuMain" style="background-color:#2a4a7c;text-align: center;">\n\n        <ion-icon name="menu" style="color: white;font-size: 40px;margin-top:10px;"></ion-icon>\n\n      </button>  \n\n    </ion-col>\n\n  </ion-row>\n\n</ion-header>\n\n\n\n<ion-content padding class="tema-app">\n\n<!--   <div *ngIf="this.servicioDb.modelo[coleccion] == 0"> -->\n\n  <div *ngIf="this.servicioFirebase.modelo[coleccion] == 0">\n\n    <ion-item>No hay información</ion-item>\n\n  </div>\n\n<!--\n\n  <ion-fab bottom right>\n\n    <button (click)="selectRow()" ion-fab mini><ion-icon name="add"></ion-icon></button>\n\n  </ion-fab>      \n\n-->\n\n<ion-searchbar [(ngModel)]="searchData"   (ionInput)="setFilter(searchData,this.servicioFirebase.modelo[coleccion])" placeholder="Buscar..."></ion-searchbar>\n\n<div *ngIf="swFind" class="spinner-container">\n\n  <ion-spinner></ion-spinner>\n\n</div>\n\n<ion-grid>\n\n    <ion-row no-padding class="hdr">\n\n      <ion-col col-1 style="text-align: center;">\n\n        # {{items.length}}\n\n      </ion-col>\n\n      <ion-col>\n\n        Caso \n\n        <button style="background-color:navy;"><ion-icon slot="icon-only" name="arrow-dropup" style="color: white;font-size: 18px;" (click)="setSort(\'titulo\')"></ion-icon></button>\n\n      </ion-col>\n\n      <ion-col >\n\n        Fecha\n\n        <button style="background-color:navy;"><ion-icon slot="icon-only" name="arrow-dropup" style="color: white;font-size: 18px;" (click)="setSort(\'dateCreation\')"></ion-icon></button>\n\n      </ion-col>\n\n      <ion-col >\n\n        Categoría\n\n        <button style="background-color:navy;"><ion-icon slot="icon-only" name="arrow-dropup" style="color: white;font-size: 18px;" (click)="setSort(\'idClassification\')"></ion-icon></button>\n\n      </ion-col>\n\n      <ion-col col-1>\n\n        Riesgo\n\n        <button style="background-color:navy;"><ion-icon slot="icon-only" name="arrow-dropup" style="color: white;font-size: 18px;" (click)="setSort(\'riesgo\')"></ion-icon></button>\n\n      </ion-col>\n\n      <ion-col col-1>\n\n        Impacto\n\n        <button style="background-color:navy;"><ion-icon slot="icon-only" name="arrow-dropup" style="color: white;font-size: 18px;" (click)="setSort(\'impacto\')"></ion-icon></button>\n\n      </ion-col>\n\n      <ion-col >\n\n        Region\n\n        <button style="background-color:navy;"><ion-icon slot="icon-only" name="arrow-dropup" style="color: white;font-size: 18px;" (click)="setSort(\'region\')"></ion-icon></button>\n\n      </ion-col>\n\n      <ion-col >\n\n        Usuario\n\n        <button style="background-color:navy;"><ion-icon slot="icon-only" name="arrow-dropup" style="color: white;font-size: 18px;" (click)="setSort(\'usuario\')"></ion-icon></button>\n\n      </ion-col>      <ion-col col-1 style="text-align: center;">\n\n        Detalle\n\n      </ion-col> \n\n    </ion-row>\n\n    <div *ngFor="let item of items; first as isFirst; even as isEven" (click)="selectRow($event, item)" text-wrap>\n\n    <ion-row no-padding [ngClass]="isFirst ? \'first\' :  isEven ? \'even\' : \'odd\'" class="pointer">\n\n      <ion-col col-1 style="text-align: center;">\n\n        {{ item.idCase}}\n\n      </ion-col>\n\n      <ion-col >\n\n        {{ item.titulo}}\n\n      </ion-col>\n\n      <ion-col >\n\n      {{ item.dateCreation | date:\'dd-MM-yy HH:mm:ss\' }}\n\n      <!-- {{ item.dateCreation }} -->\n\n      </ion-col>\n\n      <ion-col >\n\n        {{ getCategoria(item.idClassification) }}\n\n      </ion-col>\n\n      <ion-col col-1>\n\n        <div style="height: 24px; width: 24px; margin-top:1px;" *ngIf="item.riesgo==\'Alto\'" >\n\n          <img src="../../assets/imgs/circulo.png" alt="" style="height: 100%; width: 100%;" />\n\n        </div>        \n\n        <div style="height: 24px; width: 24px; margin-top:1px;" *ngIf="item.riesgo==\'Bajo\'" >\n\n          <img src="../../assets/imgs/circulov.png" alt="" style="height: 100%; width: 100%;" />\n\n        </div>\n\n        <div style="height: 24px; width: 24px; margin-top:1px;" *ngIf="item.riesgo==\'Medio\'" >\n\n          <img src="../../assets/imgs/circuloa.png" alt="" style="height: 100%; width: 100%;" />\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-1>\n\n        {{ item.impacto}}\n\n      </ion-col>\n\n       <ion-col >\n\n        {{ servicioFirebase.model["usuarios"][item.idObservador]["region"] }}  \n\n      </ion-col>      <ion-col >\n\n        {{ servicioFirebase.model["usuarios"][item.idObservador]["usuario"] }}  \n\n      </ion-col>\n\n      <ion-col col-1 style="text-align: center;">\n\n        <ion-icon name="eye" item-start class="text-primary" title="Ver detalle"></ion-icon>\n\n      </ion-col> \n\n  </ion-row>\n\n</div>\n\n </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\casos\casos.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__servicios_firebase_servicio__["a" /* ServicioFirebase */]
            //public servicioDb: ServicioDb
        ])
    ], CasosPage);
    return CasosPage;
}());

//# sourceMappingURL=casos.js.map

/***/ }),

/***/ 580:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(641);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_fire__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_fire_firestore__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_fire_storage__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_firebase_ngx__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_fire_auth__ = __webpack_require__(649);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ambiente__ = __webpack_require__(654);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__servicios_db_servicio__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__servicios_fcm_servicio__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_storage__ = __webpack_require__(655);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_camera__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_geolocation__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__angular_common_http__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_login_login_module__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_usuario_usuario_module__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_usuarios_usuarios_module__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_accion_accion_module__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_acciones_acciones_module__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_welcome_welcome_module__ = __webpack_require__(657);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_evidencias_evidencias_module__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_evidencia_evidencia_module__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_home_home__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_tabs_tabs__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_camara_camara__ = __webpack_require__(658);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_menuCatalogos_menuCatalogos__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_estado_estado__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_estados_estados__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_municipio_municipio__ = __webpack_require__(314);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_municipios_municipios__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_colonia_colonia__ = __webpack_require__(316);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_colonias_colonias__ = __webpack_require__(315);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_clase_clase__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_clases_clases__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_subclase_subclase__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_subclases_subclases__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_menuEncuestas_menuEncuestas__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_encuesta_encuesta__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_encuestas_encuestas__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_pregunta_pregunta__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_preguntas_preguntas__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__pages_opcion_opcion__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__pages_opciones_opciones__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_cuestionario_cuestionario__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_caso_caso__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__pages_casos_casos__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_table_table__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__pages_tablero_tablero__ = __webpack_require__(659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__pages_mapa_mapa__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__pages_maper_maper__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__ionic_native_status_bar__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__ionic_native_splash_screen__ = __webpack_require__(306);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















//import { Chart } from 'chart.js';








//import { WelcomePage } from '../pages/welcome/welcome';
//import { LoginPage } from '../pages/login/login';


//import { UsuarioPage } from '../pages/usuario/usuario';
//mport { UsuariosPage } from '../pages/usuarios/usuarios';




























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* ObservadorApp */],
                //  WelcomePage,
                //  LoginPage,
                __WEBPACK_IMPORTED_MODULE_25__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_tabs_tabs__["a" /* TabsPage */],
                //  UsuarioPage,
                //  UsuariosPage,
                __WEBPACK_IMPORTED_MODULE_27__pages_camara_camara__["a" /* CamaraPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_menuCatalogos_menuCatalogos__["a" /* menuCatalogos */],
                __WEBPACK_IMPORTED_MODULE_29__pages_estado_estado__["a" /* EstadoPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_estados_estados__["a" /* EstadosPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_municipio_municipio__["a" /* MunicipioPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_municipios_municipios__["a" /* MunicipiosPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_colonia_colonia__["a" /* coloniaPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_colonias_colonias__["a" /* coloniasPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_clase_clase__["a" /* ClasePage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_clases_clases__["a" /* ClasesPage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_subclase_subclase__["a" /* SubClasePage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_subclases_subclases__["a" /* SubClasesPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_menuEncuestas_menuEncuestas__["a" /* menuEncuestas */],
                __WEBPACK_IMPORTED_MODULE_40__pages_encuesta_encuesta__["a" /* EncuestaPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_encuestas_encuestas__["a" /* EncuestasPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_pregunta_pregunta__["a" /* PreguntaPage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_preguntas_preguntas__["a" /* PreguntasPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_opcion_opcion__["a" /* OpcionPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_opciones_opciones__["a" /* OpcionesPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_cuestionario_cuestionario__["a" /* CuestionarioPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_caso_caso__["a" /* CasoPage */],
                __WEBPACK_IMPORTED_MODULE_48__pages_casos_casos__["a" /* CasosPage */],
                __WEBPACK_IMPORTED_MODULE_50__pages_tablero_tablero__["a" /* TableroPage */],
                __WEBPACK_IMPORTED_MODULE_49__pages_table_table__["a" /* tablePage */],
                __WEBPACK_IMPORTED_MODULE_51__pages_mapa_mapa__["a" /* MapaPage */],
                __WEBPACK_IMPORTED_MODULE_52__pages_maper_maper__["a" /* maperPage */]
            ],
            exports: [],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_16__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* ObservadorApp */], {}, {
                    links: [
                        { loadChildren: '../pages/accion/accion.module#AccionPageModule', name: 'AccionPage', segment: 'accion', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/acciones/acciones.module#AccionesPageModule', name: 'AccionesPage', segment: 'acciones', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/evidencia/evidencia.module#evidenciaPageModule', name: 'evidenciaPage', segment: 'evidencia', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/evidencias/evidencias.module#evidenciasPageModule', name: 'evidenciasPage', segment: 'evidencias', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/usuario/usuario.module#UsuarioPageModule', name: 'UsuarioPage', segment: 'usuario', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/usuarios/usuarios.module#UsuariosPageModule', name: 'UsuariosPage', segment: 'usuarios', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_4__angular_fire__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_9__ambiente__["a" /* CONEXION_BD */].firebase),
                __WEBPACK_IMPORTED_MODULE_5__angular_fire_firestore__["b" /* AngularFirestoreModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_fire_storage__["b" /* AngularFireStorageModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_fire_auth__["a" /* AngularFireAuthModule */],
                __WEBPACK_IMPORTED_MODULE_13__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_17__pages_login_login_module__["LoginPageModule"],
                __WEBPACK_IMPORTED_MODULE_22__pages_welcome_welcome_module__["a" /* WelcomePageModule */],
                __WEBPACK_IMPORTED_MODULE_18__pages_usuario_usuario_module__["UsuarioPageModule"],
                __WEBPACK_IMPORTED_MODULE_19__pages_usuarios_usuarios_module__["UsuariosPageModule"],
                __WEBPACK_IMPORTED_MODULE_23__pages_evidencias_evidencias_module__["evidenciasPageModule"],
                __WEBPACK_IMPORTED_MODULE_24__pages_evidencia_evidencia_module__["evidenciaPageModule"],
                __WEBPACK_IMPORTED_MODULE_20__pages_accion_accion_module__["AccionPageModule"],
                __WEBPACK_IMPORTED_MODULE_21__pages_acciones_acciones_module__["AccionesPageModule"]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* ObservadorApp */],
                //    WelcomePage,
                //    LoginPage,
                __WEBPACK_IMPORTED_MODULE_25__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_tabs_tabs__["a" /* TabsPage */],
                //    UsuarioPage,
                //    UsuariosPage,
                __WEBPACK_IMPORTED_MODULE_27__pages_camara_camara__["a" /* CamaraPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_menuCatalogos_menuCatalogos__["a" /* menuCatalogos */],
                __WEBPACK_IMPORTED_MODULE_29__pages_estado_estado__["a" /* EstadoPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_estados_estados__["a" /* EstadosPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_municipio_municipio__["a" /* MunicipioPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_municipios_municipios__["a" /* MunicipiosPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_colonia_colonia__["a" /* coloniaPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_colonias_colonias__["a" /* coloniasPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_clase_clase__["a" /* ClasePage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_clases_clases__["a" /* ClasesPage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_subclase_subclase__["a" /* SubClasePage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_subclases_subclases__["a" /* SubClasesPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_menuEncuestas_menuEncuestas__["a" /* menuEncuestas */],
                __WEBPACK_IMPORTED_MODULE_40__pages_encuesta_encuesta__["a" /* EncuestaPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_encuestas_encuestas__["a" /* EncuestasPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_pregunta_pregunta__["a" /* PreguntaPage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_preguntas_preguntas__["a" /* PreguntasPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_cuestionario_cuestionario__["a" /* CuestionarioPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_opcion_opcion__["a" /* OpcionPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_opciones_opciones__["a" /* OpcionesPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_caso_caso__["a" /* CasoPage */],
                __WEBPACK_IMPORTED_MODULE_48__pages_casos_casos__["a" /* CasosPage */],
                __WEBPACK_IMPORTED_MODULE_50__pages_tablero_tablero__["a" /* TableroPage */],
                __WEBPACK_IMPORTED_MODULE_49__pages_table_table__["a" /* tablePage */],
                __WEBPACK_IMPORTED_MODULE_51__pages_mapa_mapa__["a" /* MapaPage */],
                __WEBPACK_IMPORTED_MODULE_52__pages_maper_maper__["a" /* maperPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_53__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_54__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_10__servicios_firebase_servicio__["a" /* ServicioFirebase */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_firebase_ngx__["a" /* Firebase */],
                __WEBPACK_IMPORTED_MODULE_12__servicios_fcm_servicio__["a" /* FcmService */],
                __WEBPACK_IMPORTED_MODULE_11__servicios_db_servicio__["a" /* ServicioDb */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_15__ionic_native_geolocation__["a" /* Geolocation */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 641:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObservadorApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__servicios_fcm_servicio__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__servicios_firebase_servicio__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_welcome_welcome__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_login_login__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_home_home__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_usuarios_usuarios__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_menuCatalogos_menuCatalogos__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_estados_estados__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_municipios_municipios__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_colonias_colonias__ = __webpack_require__(315);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_clases_clases__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_subclases_subclases__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_menuEncuestas_menuEncuestas__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_encuestas_encuestas__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_preguntas_preguntas__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_opciones_opciones__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_cuestionario_cuestionario__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_casos_casos__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_acciones_acciones__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_table_table__ = __webpack_require__(327);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

























var ObservadorApp = /** @class */ (function () {
    function ObservadorApp(platform, fcm, statusBar, splashScreen, app, servicioFirebase) {
        this.platform = platform;
        this.fcm = fcm;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.app = app;
        this.servicioFirebase = servicioFirebase;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */];
        this.initializeApp();
    }
    ObservadorApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            //this.notificationSetup();
        });
        this.paginas = {
            'WelcomePage': __WEBPACK_IMPORTED_MODULE_6__pages_welcome_welcome__["a" /* WelcomePage */],
            'LoginPage': __WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */],
            'HomePage': __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
            'TabsPage': __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__["a" /* TabsPage */],
            'UsuariosPage': __WEBPACK_IMPORTED_MODULE_10__pages_usuarios_usuarios__["a" /* UsuariosPage */],
            'menuCatalogos': __WEBPACK_IMPORTED_MODULE_11__pages_menuCatalogos_menuCatalogos__["a" /* menuCatalogos */],
            'EstadosPage': __WEBPACK_IMPORTED_MODULE_12__pages_estados_estados__["a" /* EstadosPage */],
            'MunicipiosPage': __WEBPACK_IMPORTED_MODULE_13__pages_municipios_municipios__["a" /* MunicipiosPage */],
            'coloniasPage': __WEBPACK_IMPORTED_MODULE_14__pages_colonias_colonias__["a" /* coloniasPage */],
            'ClasesPage': __WEBPACK_IMPORTED_MODULE_15__pages_clases_clases__["a" /* ClasesPage */],
            'SubClasesPage': __WEBPACK_IMPORTED_MODULE_16__pages_subclases_subclases__["a" /* SubClasesPage */],
            'menuEncuestas': __WEBPACK_IMPORTED_MODULE_17__pages_menuEncuestas_menuEncuestas__["a" /* menuEncuestas */],
            'EncuestasPage': __WEBPACK_IMPORTED_MODULE_18__pages_encuestas_encuestas__["a" /* EncuestasPage */],
            'PreguntasPage': __WEBPACK_IMPORTED_MODULE_19__pages_preguntas_preguntas__["a" /* PreguntasPage */],
            'OpcionesPage': __WEBPACK_IMPORTED_MODULE_20__pages_opciones_opciones__["a" /* OpcionesPage */],
            'CuestionarioPage': __WEBPACK_IMPORTED_MODULE_21__pages_cuestionario_cuestionario__["a" /* CuestionarioPage */],
            'CasosPage': __WEBPACK_IMPORTED_MODULE_22__pages_casos_casos__["a" /* CasosPage */],
            'AccionesPage': __WEBPACK_IMPORTED_MODULE_23__pages_acciones_acciones__["a" /* AccionesPage */],
            'tablePage': __WEBPACK_IMPORTED_MODULE_24__pages_table_table__["a" /* tablePage */],
        };
    };
    //
    ObservadorApp.prototype.presentToast = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                alert(message);
                return [2 /*return*/];
            });
        });
    };
    ObservadorApp.prototype.notificationSetup = function () {
        var _this = this;
        this.fcm.getToken();
        this.fcm.onNotifications().subscribe(function (msg) {
            if (_this.platform.is('ios')) {
                _this.presentToast(msg.aps.alert);
            }
            else {
                _this.presentToast(msg.body);
            }
        });
    };
    //
    ObservadorApp.prototype.openPage = function (page) {
        //this.rootPage = paginas[pagina]; 
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        //this.nav.setRoot(page.component);
        this.nav.setRoot(this.paginas[page]);
    };
    ObservadorApp.prototype.openRollPage = function (page, rollPage) {
        //this.navCtrl.push(this.paginas[page],{rollPage : rollPage});
        this.app.getRootNav().setRoot(this.paginas[page], { rollPage: rollPage });
    };
    ObservadorApp.prototype.logout = function (page) {
        //this.rootPage = WelcomePage;
        //this.nav.setRoot(this.paginas[page]);
        //this.app.getRootNav().popToRoot();
        this.nav.setRoot(this.paginas[page]);
        //this.platform.exitApp();
        //navigator[navigator.appName].exitApp();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */])
    ], ObservadorApp.prototype, "nav", void 0);
    ObservadorApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\app\app.html"*/'<ion-menu id="menuMain" [content]="mycontent" side="end">\n\n    <ion-content>\n\n      <ion-list>\n\n        <h6>Menu Principal</h6>\n\n        <button ion-item menuClose (click)="openPage(\'tablePage\')"\n\n          *ngIf="servicioFirebase.roles.includes(\'Ejecutivo\')">Tablero</button>\n\n        <button ion-item menuClose (click)="openPage(\'CasosPage\')"\n\n          *ngIf="servicioFirebase.roles.includes(\'Supervisor\')">Casos</button>\n\n        <button ion-item menuClose (click)="openPage(\'AccionesPage\')"\n\n          *ngIf="servicioFirebase.roles.includes(\'Supervisor\')">Acciones</button>\n\n        <button ion-item menuClose (click)="openPage(\'menuEncuestas\')" \n\n          *ngIf="servicioFirebase.roles.includes(\'Supervisor\')">Encuestas</button>\n\n        <button ion-item menuClose (click)="openPage(\'UsuariosPage\')" \n\n          *ngIf="servicioFirebase.roles.includes(\'Administrador\')">Usuarios</button>\n\n        <button ion-item menuClose (click)="openPage(\'menuCatalogos\')" \n\n          *ngIf="servicioFirebase.roles.includes(\'Administrador\')">Catálogos</button>\n\n\n\n        <!--\n\n        <button ion-item menuClose (click)="openPage(\'AccionesPage\')">Acciones</button>\n\n        <button ion-item menuClose (click)="openPage(\'TabsPage\')">Tablero</button>\n\n        -->\n\n        <button ion-item (click)="logout(\'LoginPage\')" menuClose>Salir</button>\n\n      </ion-list>\n\n    </ion-content>\n\n</ion-menu>\n\n\n\n<ion-menu id="menuCatalogos" [content]="mycontent" persistent=true side="end">\n\n    <ion-content>\n\n      <ion-list>\n\n        <h6>Catálogos</h6>\n\n        <button ion-item (click)="openPage(\'EstadosPage\')" menuClose>Estados</button>\n\n        <button ion-item (click)="openPage(\'MunicipiosPage\')" menuClose>Municipios</button>\n\n        <button ion-item (click)="openPage(\'coloniasPage\')" menuClose>Colonias</button>\n\n        <button ion-item (click)="openPage(\'ClasesPage\')" menuClose>Categoría</button>\n\n        <button ion-item (click)="openPage(\'SubClasesPage\')" menuClose>Sub Categoría</button>\n\n        <button ion-item (click)="openPage(\'HomePage\')" menuClose>Cerrar Menu</button>\n\n      </ion-list>\n\n    </ion-content>\n\n</ion-menu>\n\n\n\n<ion-menu id="menuEncuestas" [content]="mycontent" persistent=true side="end">\n\n    <ion-content>\n\n      <ion-list>\n\n        <h6>Encuestas</h6>\n\n        <button ion-item (click)="openRollPage(\'EncuestasPage\',\'encuestas\')" menuClose>Encuestas</button>\n\n        <button ion-item (click)="openRollPage(\'EncuestasPage\',\'preguntas\')" menuClose>Preguntas</button>\n\n        <button ion-item (click)="openRollPage(\'EncuestasPage\',\'opciones\')" menuClose>Opciones</button>\n\n        <button ion-item (click)="openPage(\'CuestionarioPage\',\'cuestionario\')" menuClose>Cuestionario</button>\n\n        <button ion-item (click)="openPage(\'HomePage\')" menuClose>Cerrar Menu</button>\n\n      </ion-list>\n\n    </ion-content>\n\n</ion-menu>\n\n \n\n<ion-nav #mycontent [root]="rootPage"></ion-nav>\n\n'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_4__servicios_fcm_servicio__["a" /* FcmService */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_5__servicios_firebase_servicio__["a" /* ServicioFirebase */]])
    ], ObservadorApp);
    return ObservadorApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 654:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CONEXION_BD; });
var CONEXION_BD = {
    /*
        firebase: {
            apiKey: "AIzaSyBZUhH2ipm5U4MKXIQc-dfMrLDkTBkb92E",
            authDomain: "observatoriociudadano-3a68f.firebaseapp.com",
            databaseURL: "https://observatoriociudadano-3a68f.firebaseio.com",
            projectId: "observatoriociudadano-3a68f",
            storageBucket: "observatoriociudadano-3a68f.appspot.com",
            messagingSenderId: "853621425484"
        }
    //
        firebase: {
            apiKey: "AIzaSyAd1bVphgVETZZ6mYbh7RxK5yMZ1XJEU_0",
            authDomain: "observatorio-d6ad7.firebaseapp.com",
            databaseURL: "https://observatorio-d6ad7.firebaseio.com",
            projectId: "observatorio-d6ad7",
            storageBucket: "observatorio-d6ad7.appspot.com",
            messagingSenderId: "133886977164",
            appId: "1:133886977164:web:a949779686bf2390"
        }
    */
    //  Produccción
    firebase: {
        apiKey: "AIzaSyBOQckJbLo8FqjCtFfbEh_4ts3QEUUECBs",
        authDomain: "pm-soluciones.firebaseapp.com",
        databaseURL: "https://pm-soluciones.firebaseio.com",
        projectId: "pm-soluciones",
        storageBucket: "pm-soluciones.appspot.com",
        messagingSenderId: "635721467659",
        appId: "1:635721467659:web:b61ae66d61360ceba5840e",
        measurementId: "G-SQHG4HWFYZ"
    }
    //  
    /* Desarrollo
        firebase : {
        apiKey: "AIzaSyDzxCl4NU8qzJukTpAHTIpDKhFloyb_Hdc",
        authDomain: "observadores-ciudadano-qa.firebaseapp.com",
        databaseURL: "https://observadores-ciudadano-qa.firebaseio.com",
        projectId: "observadores-ciudadano-qa",
        storageBucket: "observadores-ciudadano-qa.appspot.com",
        messagingSenderId: "732955602661",
        appId: "1:732955602661:web:a47ead6ce7517cfe59ee0c",
        measurementId: "G-PNFZMHCCT2"
        }
    */
};
//# sourceMappingURL=ambiente.js.map

/***/ }),

/***/ 657:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WelcomePageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__welcome__ = __webpack_require__(309);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var WelcomePageModule = /** @class */ (function () {
    function WelcomePageModule() {
    }
    WelcomePageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__welcome__["a" /* WelcomePage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__welcome__["a" /* WelcomePage */])
                //    IonicPageModule,
            ],
        })
    ], WelcomePageModule);
    return WelcomePageModule;
}());

//# sourceMappingURL=welcome.module.js.map

/***/ }),

/***/ 658:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CamaraPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_camera__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__servicios_firebase_servicio__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

//import { NavController } from 'ionic-angular';


//import { VideoCapturePlus, VideoCapturePlusOptions, MediaFile } from '@ionic-native/video-capture-plus/ngx';



var CamaraPage = /** @class */ (function () {
    function CamaraPage(camera, geolocation, servicioFirebase, sanitizer, navParams
        //  private videoCapturePlus: VideoCapturePlus) 
    ) {
        this.camera = camera;
        this.geolocation = geolocation;
        this.servicioFirebase = servicioFirebase;
        this.sanitizer = sanitizer;
        this.navParams = navParams;
        this.url = "https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Faccidente.jpg?alt=media&token=abf0dad0-e73c-464c-a1d6-7554cc4969d9";
        this.url2 = "https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Fevidencia2.jpg?alt=media&token=ad01a848-902f-4c5f-bd51-1ebe8e1d1cf9";
        this.url3 = "https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Fevidencia3.jpg?alt=media&token=c58e01ba-80c3-4cd7-b344-c454a43cc321";
        this.url4 = "https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Fevidencia4.jpg?alt=media&token=74f7de70-2136-47ce-af92-78a63921c729";
        this.doc = navParams.data;
        this.url2 = this.doc.urlPhoto;
    }
    CamaraPage.prototype.getEvidencia = function () {
        this.getFoto();
        this.getLocation();
    };
    CamaraPage.prototype.takePicture1 = function () {
        var _this = this;
        var options = {
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 100
        };
        this.camera.getPicture(options)
            .then(function (imageData) {
            //this.currentImage = 'data:image/jpeg;base64,${imageData}';
            _this.currentImage = 'data:image/jpeg;base64,' + imageData;
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    //
    CamaraPage.prototype.getFoto = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        console.log("Camera click:");
        this.camera.getPicture(options).then(function (imageData) {
            //Send the picture to Firebase Storage
            _this.foto = 'data:image/jpeg;base64,' + imageData;
            //this.foto = imageData;
            _this.servicioFirebase.fileUpload(imageData);
        }, function (err) {
            // Handle error
            console.log("Camera issue:" + err);
        });
    };
    CamaraPage.prototype.fileUpload = function (event) {
        this.file = event.target.files[0];
        console.log("File:", this.file);
        this.getImagen(this.file);
        //this.imagen = 'data:image/jpg;base64, '+ this.file; 
        //this.imagen = 'data:image/jpeg;data_url,' + this.file; 
        //this.servicioFirebase.fileUpload(this.file);
    };
    //
    CamaraPage.prototype.getLocation = function () {
        var _this = this;
        var options = {
            enableHighAccuracy: false,
            timeout: 3000,
            maximumAge: 0
        };
        this.geolocation.getCurrentPosition(options).then(function (resp) {
            _this.coords = resp.coords;
            _this.latitud = _this.coords.latitude;
            _this.longitud = _this.coords.longitude;
            console.log('Latitude', _this.coords.latitude);
            console.log('Longitude', _this.coords.longitude);
        }).catch(function (error) {
            console.log('Error getting location', error);
        });
        var watch = this.geolocation.watchPosition();
        watch.subscribe(function (resp) {
            _this.coords = resp.coords;
            _this.latitud = _this.coords.latitude;
            _this.longitud = _this.coords.longitude;
            console.log('Latitude', _this.coords.latitude);
            console.log('Longitude', _this.coords.longitude);
        });
    };
    CamaraPage.prototype.getImagen = function (data) {
        if (data != null) {
            var imageData = btoa(data);
            //this.imagen = this.sanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64,"+imageData);
            this.imagen = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/jpeg;base64," + imageData);
            console.log("Base64 Image: ", this.imagen);
        }
    };
    CamaraPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-camara',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\camara\camara.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>\n\n      Evidencias del caso\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<!--\n\n<ion-content>\n\n  <img [src]="foto" *ngIf="foto">\n\n  <ion-fab top left>\n\n    <button (click)="getLocation()" ion-fab mini><ion-icon name="map"></ion-icon></button>\n\n  </ion-fab> \n\n  <ion-fab top right>\n\n    <button (click)="getFoto()" ion-fab mini><ion-icon name="camera"></ion-icon></button>\n\n  </ion-fab>\n\n  <input type="file" (change)="fileUpload($event)">\n\n  <br><br><br><br>     \n\n  <img [src]="foto" *ngIf="foto">\n\n  <div *ngIf="imagen">\n\n    Imagen:<br>\n\n    <img [src]="imagen" width="100%" height="100%" alt="Imagen" />\n\n  </div>\n\n  <p>\n\n     Latitude: {{latitud}} Longitud: {{longitud}}\n\n  </p>\n\n  \n\n</ion-content>\n\n-->\n\n<ion-content>\n\n<ion-grid><ion-row>\n\n  <ion-col>\n\n    <ion-card>\n\n      <ion-card-header>\n\n        Crucero Peligroso\n\n      </ion-card-header>\n\n      <ion-card-content>\n\n          <ion-img [src]="url"  height=\'300\' width=\'500\'></ion-img>\n\n        </ion-card-content>\n\n    </ion-card>\n\n  </ion-col>\n\n  <ion-col>\n\n    <ion-card>\n\n      <ion-card-header>\n\n        Accidentes frecuentes \n\n      </ion-card-header>\n\n      <ion-card-content>\n\n          <ion-img [src]="url2"  height=\'300\' width=\'500\'></ion-img>\n\n      </ion-card-content>\n\n    </ion-card>\n\n  </ion-col>\n\n  </ion-row>\n\n  <ion-row>\n\n    <ion-col>\n\n      <ion-card>\n\n      <ion-card-header>\n\n        Afectación de circulación vial\n\n      </ion-card-header>\n\n      <ion-card-content>\n\n          <ion-img [src]="url3"  height=\'300\' width=\'500\'></ion-img>\n\n      </ion-card-content>\n\n      </ion-card>\n\n    </ion-col>\n\n    <ion-col>\n\n        <ion-card>\n\n          <ion-card-header>\n\n            Perdidas materiales \n\n          </ion-card-header>\n\n          <ion-card-content>\n\n              <ion-img [src]="url4"  height=\'300\' width=\'500\'></ion-img>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n      </ion-row>\n\n</ion-grid>\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\camara\camara.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_5__servicios_firebase_servicio__["a" /* ServicioFirebase */],
            __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["c" /* DomSanitizer */],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["j" /* NavParams */]
            //  private videoCapturePlus: VideoCapturePlus) 
        ])
    ], CamaraPage);
    return CamaraPage;
}());

//# sourceMappingURL=camara.js.map

/***/ }),

/***/ 659:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TableroPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TableroPage = /** @class */ (function () {
    function TableroPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    TableroPage.prototype.ionViewDidLoad = function () {
        this.barChart = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
            },
            options: {
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });
        this.doughnutChart = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56"
                        ]
                    }]
            }
        });
        this.lineChart = new __WEBPACK_IMPORTED_MODULE_2_chart_js__["Chart"](this.lineCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40],
                        spanGaps: false,
                    }
                ]
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('barCanvas'),
        __metadata("design:type", Object)
    ], TableroPage.prototype, "barCanvas", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('doughnutCanvas'),
        __metadata("design:type", Object)
    ], TableroPage.prototype, "doughnutCanvas", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineCanvas'),
        __metadata("design:type", Object)
    ], TableroPage.prototype, "lineCanvas", void 0);
    TableroPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-tablero',template:/*ion-inline-start:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\tablero\tablero.html"*/'<ion-header>\n\n  <ion-navbar color="danger">\n\n    <ion-title>\n\n      Tablero \n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n    <ion-card>\n\n      <ion-card-header>\n\n        Percepción ciudadana\n\n      </ion-card-header>\n\n      <ion-card-content>\n\n        <canvas #barCanvas></canvas>\n\n      </ion-card-content>\n\n    </ion-card>\n\n\n\n    <ion-card>\n\n      <ion-card-header>\n\n        Participación ciudadana\n\n      </ion-card-header>\n\n      <ion-card-content>\n\n        <canvas #doughnutCanvas></canvas>\n\n      </ion-card-content>\n\n    </ion-card>\n\n\n\n    <ion-card>\n\n      <ion-card-header>\n\n        Eficiencia en acciones\n\n      </ion-card-header>\n\n      <ion-card-content>\n\n        <canvas #lineCanvas></canvas>\n\n      </ion-card-content>\n\n    </ion-card>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Users\rromero\Documents\Ionic\Observadores\appweb\src\pages\tablero\tablero.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], TableroPage);
    return TableroPage;
}());

//# sourceMappingURL=tablero.js.map

/***/ }),

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 332,
	"./af.js": 332,
	"./ar": 333,
	"./ar-dz": 334,
	"./ar-dz.js": 334,
	"./ar-kw": 335,
	"./ar-kw.js": 335,
	"./ar-ly": 336,
	"./ar-ly.js": 336,
	"./ar-ma": 337,
	"./ar-ma.js": 337,
	"./ar-sa": 338,
	"./ar-sa.js": 338,
	"./ar-tn": 339,
	"./ar-tn.js": 339,
	"./ar.js": 333,
	"./az": 340,
	"./az.js": 340,
	"./be": 341,
	"./be.js": 341,
	"./bg": 342,
	"./bg.js": 342,
	"./bm": 343,
	"./bm.js": 343,
	"./bn": 344,
	"./bn.js": 344,
	"./bo": 345,
	"./bo.js": 345,
	"./br": 346,
	"./br.js": 346,
	"./bs": 347,
	"./bs.js": 347,
	"./ca": 348,
	"./ca.js": 348,
	"./cs": 349,
	"./cs.js": 349,
	"./cv": 350,
	"./cv.js": 350,
	"./cy": 351,
	"./cy.js": 351,
	"./da": 352,
	"./da.js": 352,
	"./de": 353,
	"./de-at": 354,
	"./de-at.js": 354,
	"./de-ch": 355,
	"./de-ch.js": 355,
	"./de.js": 353,
	"./dv": 356,
	"./dv.js": 356,
	"./el": 357,
	"./el.js": 357,
	"./en-SG": 358,
	"./en-SG.js": 358,
	"./en-au": 359,
	"./en-au.js": 359,
	"./en-ca": 360,
	"./en-ca.js": 360,
	"./en-gb": 361,
	"./en-gb.js": 361,
	"./en-ie": 362,
	"./en-ie.js": 362,
	"./en-il": 363,
	"./en-il.js": 363,
	"./en-nz": 364,
	"./en-nz.js": 364,
	"./eo": 365,
	"./eo.js": 365,
	"./es": 366,
	"./es-do": 367,
	"./es-do.js": 367,
	"./es-us": 368,
	"./es-us.js": 368,
	"./es.js": 366,
	"./et": 369,
	"./et.js": 369,
	"./eu": 370,
	"./eu.js": 370,
	"./fa": 371,
	"./fa.js": 371,
	"./fi": 372,
	"./fi.js": 372,
	"./fo": 373,
	"./fo.js": 373,
	"./fr": 374,
	"./fr-ca": 375,
	"./fr-ca.js": 375,
	"./fr-ch": 376,
	"./fr-ch.js": 376,
	"./fr.js": 374,
	"./fy": 377,
	"./fy.js": 377,
	"./ga": 378,
	"./ga.js": 378,
	"./gd": 379,
	"./gd.js": 379,
	"./gl": 380,
	"./gl.js": 380,
	"./gom-latn": 381,
	"./gom-latn.js": 381,
	"./gu": 382,
	"./gu.js": 382,
	"./he": 383,
	"./he.js": 383,
	"./hi": 384,
	"./hi.js": 384,
	"./hr": 385,
	"./hr.js": 385,
	"./hu": 386,
	"./hu.js": 386,
	"./hy-am": 387,
	"./hy-am.js": 387,
	"./id": 388,
	"./id.js": 388,
	"./is": 389,
	"./is.js": 389,
	"./it": 390,
	"./it-ch": 391,
	"./it-ch.js": 391,
	"./it.js": 390,
	"./ja": 392,
	"./ja.js": 392,
	"./jv": 393,
	"./jv.js": 393,
	"./ka": 394,
	"./ka.js": 394,
	"./kk": 395,
	"./kk.js": 395,
	"./km": 396,
	"./km.js": 396,
	"./kn": 397,
	"./kn.js": 397,
	"./ko": 398,
	"./ko.js": 398,
	"./ku": 399,
	"./ku.js": 399,
	"./ky": 400,
	"./ky.js": 400,
	"./lb": 401,
	"./lb.js": 401,
	"./lo": 402,
	"./lo.js": 402,
	"./lt": 403,
	"./lt.js": 403,
	"./lv": 404,
	"./lv.js": 404,
	"./me": 405,
	"./me.js": 405,
	"./mi": 406,
	"./mi.js": 406,
	"./mk": 407,
	"./mk.js": 407,
	"./ml": 408,
	"./ml.js": 408,
	"./mn": 409,
	"./mn.js": 409,
	"./mr": 410,
	"./mr.js": 410,
	"./ms": 411,
	"./ms-my": 412,
	"./ms-my.js": 412,
	"./ms.js": 411,
	"./mt": 413,
	"./mt.js": 413,
	"./my": 414,
	"./my.js": 414,
	"./nb": 415,
	"./nb.js": 415,
	"./ne": 416,
	"./ne.js": 416,
	"./nl": 417,
	"./nl-be": 418,
	"./nl-be.js": 418,
	"./nl.js": 417,
	"./nn": 419,
	"./nn.js": 419,
	"./pa-in": 420,
	"./pa-in.js": 420,
	"./pl": 421,
	"./pl.js": 421,
	"./pt": 422,
	"./pt-br": 423,
	"./pt-br.js": 423,
	"./pt.js": 422,
	"./ro": 424,
	"./ro.js": 424,
	"./ru": 425,
	"./ru.js": 425,
	"./sd": 426,
	"./sd.js": 426,
	"./se": 427,
	"./se.js": 427,
	"./si": 428,
	"./si.js": 428,
	"./sk": 429,
	"./sk.js": 429,
	"./sl": 430,
	"./sl.js": 430,
	"./sq": 431,
	"./sq.js": 431,
	"./sr": 432,
	"./sr-cyrl": 433,
	"./sr-cyrl.js": 433,
	"./sr.js": 432,
	"./ss": 434,
	"./ss.js": 434,
	"./sv": 435,
	"./sv.js": 435,
	"./sw": 436,
	"./sw.js": 436,
	"./ta": 437,
	"./ta.js": 437,
	"./te": 438,
	"./te.js": 438,
	"./tet": 439,
	"./tet.js": 439,
	"./tg": 440,
	"./tg.js": 440,
	"./th": 441,
	"./th.js": 441,
	"./tl-ph": 442,
	"./tl-ph.js": 442,
	"./tlh": 443,
	"./tlh.js": 443,
	"./tr": 444,
	"./tr.js": 444,
	"./tzl": 445,
	"./tzl.js": 445,
	"./tzm": 446,
	"./tzm-latn": 447,
	"./tzm-latn.js": 447,
	"./tzm.js": 446,
	"./ug-cn": 448,
	"./ug-cn.js": 448,
	"./uk": 449,
	"./uk.js": 449,
	"./ur": 450,
	"./ur.js": 450,
	"./uz": 451,
	"./uz-latn": 452,
	"./uz-latn.js": 452,
	"./uz.js": 451,
	"./vi": 453,
	"./vi.js": 453,
	"./x-pseudo": 454,
	"./x-pseudo.js": 454,
	"./yo": 455,
	"./yo.js": 455,
	"./zh-cn": 456,
	"./zh-cn.js": 456,
	"./zh-hk": 457,
	"./zh-hk.js": 457,
	"./zh-tw": 458,
	"./zh-tw.js": 458
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 662;

/***/ })

},[459]);
//# sourceMappingURL=main.js.map