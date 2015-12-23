

RFCs = new Meteor.Collection("RFCs");


RFCs.allow({
  insert: function (userId, infoFiscal) {
    return false; // no cowboy inserts -- use createFactura method
  },
  update: function () {

      /*

       function (userId, infoFiscals, fields, modifier) {
      return _.all(infoFiscals, function (infoFiscal) {
      if (userId !== infoFiscal.owner)
        return false; // not the owner

      var allowed = ["rfc", "razonSocial", "calle", "numExt", "numInt", "colonia",
                    "municipio", "estado", "codigoPostal", "solicitudes"];
      if (_.difference(fields, allowed).length)
        return false; // tried to write to forbidden field

      // A good improvement would be to validate the type of the new
      // value of the field (and if a string, the length.) In the
      // future Meteor will have a schema system to makes that easier.

      */

      return true;

  },
  remove: function (userId, infoFiscals) {
    return ! _.any(infoFiscals, function (infoFiscal) {
      // deny if not the owner
      return infoFiscal.owner !== userId;
    });
  }
});



Meteor.methods({
  // options should include: rfc, razonSocial, calle, etc
  crearDatosFiscales: function (options) {
    options = options || {};
    var patronRFC = new RegExp('[A-Z,Ñ&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9][A-Z,0-9][0-9,A-Z]', "i");
    var patronCodigoPostal = new RegExp('[0-9]{5}');
    if (! (typeof options.rfc === "string" && 
           options.rfc.length &&
           typeof options.razonSocial === "string" &&
           options.razonSocial.length &&
           typeof options.calle === "string" &&
           options.calle.length &&
           typeof options.numExt === "string" &&
           options.numExt.length &&
           typeof options.numInt === "string" &&
           //options.numInt.length &&
           typeof options.colonia === "string" &&
           options.colonia.length &&
           typeof options.municipio === "string" &&
           options.municipio.length &&
           typeof options.estado === "string" &&
           options.estado.length &&
           typeof options.codigoPostal === "string" &&
           options.codigoPostal.length))
       throw new Meteor.Error(400, "Faltan datos fiscales");
    if (!patronRFC.test(options.rfc) || options.rfc.trim().length > 13)
        throw new Meteor.Error(413, "RFC no valido");
    if (!isNaN(options.rfc.charAt(3)) && options.rfc.trim().length > 12)
        throw new Meteor.Error(413, "RFC no valido");
    if (!patronCodigoPostal.test(options.codigoPostal) ||
        options.codigoPostal.length != 5)
        throw new Meteor.Error(413, "Codigo Postal no valido");
    if (options.estado == "Selecione el estado")
        throw new Meteor.Error(413, "No selecionó estado");
    if (options.calle.length > 50)
        throw new Meteor.Error(413, "Calle demasiado largo. Abrevie por favor");
    if (options.razonSocial.length > 100)
        throw new Meteor.Error(413, "Razón Social demasiado larga. Abrevie por favor");
    if (options.numExt.length > 15)
        throw new Meteor.Error(413, "Num Ext demasiado largo. Abrevie por favor");
    var sinEspacios = options.numExt.toString().trim()
    if (sinEspacios.length < 1)
        throw new Meteor.Error(413, "Número Exterior debe contener al menos un caracter (no espacio)");
    if (options.numInt.length >15)
        throw new Meteor.Error(413, "Num Int demasiado largo. Abrevie por favor");
    if (options.colonia.length > 50)
        throw new Meteor.Error(413, "Colonia demasiado larga. Abrevie por favor");
    if (options.pais  && !(typeof options.pais === "string" &&
        options.pais.length))
        throw  new Meteor.Error(413, "Verificar País");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    var datosInsert = {
        owner: this.userId,
        rfc: options.rfc.toUpperCase(),
        razonSocial: options.razonSocial,
        calle: options.calle,
        numExt: options.numExt,
        numInt: options.numInt.toString().trim(),
        colonia: options.colonia,
        municipio: options.municipio,
        estado: options.estado,
        codigoPostal: options.codigoPostal
    };

    if (options.pais)
        datosInsert.pais = options.pais;

    return RFCs.insert(datosInsert);
  },

    // options should include: rfc, razonSocial, calle, etc
  cambiaDatosFiscales: function (options) {
        options = options || {};
        var patronRFC = new RegExp('[A-Z,Ñ&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z|0-9][A-Z|0-9][0-9,A-Z]', "i");
        var patronCodigoPostal = new RegExp('[0-9]{5,5}');
        if (! (typeof options.rfc === "string" &&
            options.rfc.length &&
            typeof options.razonSocial === "string" &&
            options.razonSocial.length &&
            typeof options.calle === "string" &&
            options.calle.length &&
            typeof options.numExt === "string" &&
            options.numExt.length &&
            typeof options.numInt === "string" &&
            //options.numInt.length &&
            typeof options.colonia === "string" &&
            options.colonia.length &&
            typeof options.municipio === "string" &&
            options.municipio.length &&
            typeof options.estado === "string" &&
            options.estado.length &&
            typeof options.codigoPostal === "string" &&
            options.codigoPostal.length))
            throw new Meteor.Error(400, "Faltan datos fiscales");
        if (!patronRFC.test(options.rfc) || options.rfc.trim().length > 13)
            throw new Meteor.Error(413, "RFC no valido");
        if (!isNaN(options.rfc.charAt(3)) && options.rfc.trim().length > 12)
            throw new Meteor.Error(413, "RFC no valido");
        if (!patronCodigoPostal.test(options.codigoPostal) ||
            options.codigoPostal.length != 5)
            throw new Meteor.Error(413, "Codigo Postal no valido");
        if (options.estado == "Selecione el estado")
            throw new Meteor.Error(413, "No selecionó estado");
        if (options.calle.length > 50)
            throw new Meteor.Error(413, "Calle demasiado larga. Abrevie por favor");
        if (options.razonSocial.length > 100)
            throw new Meteor.Error(413, "Razón Social demasiado larga. Abrevie por favor");
        if (options.numExt.length > 15)
            throw  new Meteor.Error(413, "Num Ext demasiado largo. Abrevie por favor");
        var sinEspacios = options.numExt.toString().trim()
        if (sinEspacios.length < 1)
            throw new Meteor.Error(413, "Número Exterior debe contener al menos un caracter (no espacio)");
        if (options.numInt.length >15)
            throw  new Meteor.Error(413, "Num Int demasiado largo. Abrevie por favor");
        if (options.colonia.length > 50)
            throw new Meteor.Error(413, "Colonia demasiado larga. Abrevie por favor");

        if (! this.userId)
            throw new Meteor.Error(403, "You must be logged in");

        var datosUpdate = {
            rfc: options.rfc.toUpperCase(),
            razonSocial: options.razonSocial,
            calle: options.calle,
            numExt: options.numExt,
            numInt: options.numInt.toString().trim(),
            colonia: options.colonia,
            municipio: options.municipio,
            estado: options.estado,
            codigoPostal: options.codigoPostal
        };

        if (options.pais)
            datosUpdate.pais = options.pais;

        return RFCs.update({_id: options.id}, {$set: datosUpdate});
  },
