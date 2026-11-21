<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <NamedLayer><Name>okruzi</Name><UserStyle><Title>Okruzi</Title>
    <FeatureTypeStyle><Rule><Title>Okrug</Title>
      <PolygonSymbolizer>
        <Fill><CssParameter name="fill">#8ecae6</CssParameter><CssParameter name="fill-opacity">0.25</CssParameter></Fill>
        <Stroke><CssParameter name="stroke">#1d3557</CssParameter><CssParameter name="stroke-width">1</CssParameter></Stroke>
      </PolygonSymbolizer>
      <TextSymbolizer>
        <Label><ogc:PropertyName>Naziv</ogc:PropertyName></Label>
        <Font><CssParameter name="font-family">Arial</CssParameter><CssParameter name="font-size">10</CssParameter><CssParameter name="font-weight">bold</CssParameter></Font>
        <LabelPlacement><PointPlacement><AnchorPoint><AnchorPointX>0.5</AnchorPointX><AnchorPointY>0.5</AnchorPointY></AnchorPoint></PointPlacement></LabelPlacement>
        <Halo><Radius>1.5</Radius><Fill><CssParameter name="fill">#ffffff</CssParameter></Fill></Halo>
        <Fill><CssParameter name="fill">#1d3557</CssParameter></Fill>
        <VendorOption name="autoWrap">60</VendorOption><VendorOption name="maxDisplacement">20</VendorOption>
      </TextSymbolizer>
    </Rule></FeatureTypeStyle>
  </UserStyle></NamedLayer>
</StyledLayerDescriptor>