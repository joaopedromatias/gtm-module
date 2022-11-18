import GoogleTagManager from "./GoogleTagManager";

declare global { 
    interface dataLayerObj {
        [parameter: string]: string | number | null | boolean | object | Array <string | null | number | object | boolean>
    }

    interface Window { 
        dataLayer: dataLayerObj[]
    }
}

describe('GoogleTagManager', () => { 
    it('should start the gtm object with the provided values', () => { 

        const gtmArgs = { 
            gtmId: 'GTM-0000000',
            sanitizeDataLayer: false,
            resetDataLayer: false,
            ssDomain: 'data.domain.com.br'
        }

        const gtm = new GoogleTagManager(gtmArgs);

        const gtmIdConfig = gtm.gtmId;
        const clearDataLayerConfig = gtm.resetDataLayer;
        const ssDomainConfig = gtm.ssDomain;

        expect(gtmIdConfig).toBe(gtmArgs.gtmId)
        expect(clearDataLayerConfig).toBe(gtmArgs.resetDataLayer)
        expect(ssDomainConfig).toBe(gtmArgs.ssDomain)
    })

    describe('initialize()', () => { 

        beforeEach(() => { 
            window.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body></body></html>`)
        })

        afterEach(() => {
            window.document.write(``)
        })

        it('should initialize the google tag manager container if a gtmId is provided', () => { 
            const gtm = new GoogleTagManager({gtmId: 'GTM-0000000'});  

            gtm.initialize();

            const gtmSnippet = document.head.querySelector('script')
            
            expect(gtmSnippet).toBeDefined();
        })

        it('should initialize the google tag manager with the provided id and with the server side domain (if it is configured)', () => { 
            const gtm = new GoogleTagManager({gtmId: 'GTM-1234567', ssDomain: 'data.domain.com'});  
            
            gtm.initialize();

            const gtmSnippet = document.head.querySelector('script');

            const gtmSnippetSrc = (gtmSnippet || {}).src
            
            expect(gtmSnippetSrc).toBe('https://data.domain.com/gtm.js?id=GTM-1234567')
        })
    
        it('should not initialize the google tag manager container if a gtmId is not provided', () => { 
            const gtm = new GoogleTagManager({});  

            gtm.initialize();
            
            const gtmSnippet = document.head.querySelector('script');
            
            expect(gtmSnippet).toBe(null);
        })
    })

    describe('dataLayerPush()', () => { 
    
        beforeEach(() => { 
            window.dataLayer = []
        })

        it('should push the object to dataLayer', () => { 
            
            const gtm = new GoogleTagManager({gtmId: 'GTM-0000000'})

            const dataLayerObj = { 
                event: 'click',
                element: 'cta-bottom'
            }

            gtm.dataLayerPush(dataLayerObj);

            expect(window.dataLayer[0].event).toBe('click')
            expect(window.dataLayer[0].element).toBe('cta-bottom')
            
        })
    })

})