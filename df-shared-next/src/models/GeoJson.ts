import { Address } from './Address'

export class GeoJson {
  type = 'FeatureCollection'
  features: Address[] = []
  query = ''
}
