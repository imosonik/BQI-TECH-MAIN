import Head from 'next/head';
import * as gtag from '@/lib/gtag';

<Head>
  <link 
    rel="preload" 
    as="script" 
    href={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
  />
</Head> 