const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },

  gallery: {
    type: [String],
  },
  information: {
    type: String,
    required: [true, 'Information is required'],
    minLength: [50, 'Information must have atleast 50 characters'],
  },
  businessType: String,
  mainProduct: String,
  annualRevenue: String,
  factoryAddress: String,
  rndCapacity: String,
  rndStaff: String,
  productionLines: String,
  annualOutput: String,
  //   International

  internationalCommercial: String,
  paymentMethods: String,
  foreignStaff: String,
  exportYear: String,
  exportPercentage: String,
  mainMarkets: [String],
  importExportMode: String,

  //   Certificates
  certificates: [String],

  shopOwner: {
    type: mongoose.SchemaTypes.ObjectId,
  },
});

const Shop = mongoose.model('shops', shopSchema);

module.exports = Shop;
