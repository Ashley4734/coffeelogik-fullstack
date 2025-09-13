import type { Schema, Struct } from '@strapi/strapi';

export interface ProductHardwareSpecifications extends Struct.ComponentSchema {
  collectionName: 'components_product_hardware_specifications';
  info: {
    description: 'Holds technical specifications for hardware like grinders and coffee makers.';
    displayName: 'Hardware Specifications';
    icon: 'cogs';
  };
  attributes: {
    burr_type: Schema.Attribute.Enumeration<['Conical', 'Flat']>;
    capacity: Schema.Attribute.String;
    dimensions: Schema.Attribute.String;
    grind_settings: Schema.Attribute.String;
    grinder_type: Schema.Attribute.Enumeration<['Burr', 'Blade']>;
    materials: Schema.Attribute.JSON;
    power: Schema.Attribute.String;
    weight: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.hardware-specifications': ProductHardwareSpecifications;
    }
  }
}
