const config = {
  site: {
    title: '赖同学',
    url: 'https://laibh.com',
    description: 'Hexo-Next-Theme Next.js Blog',
    publisherName: '赖同学',
    authorName: [
      {
        name: '赖同学',
        url: 'https://laibh.com'
      }
    ]
  },
  layout: {
    siderWidth: 300
  },
  authorLinks: [
    { title: 'GitHub', link: 'https://github.com/LbhFront-end', icon: 'fa-github' },
    { title: 'E-Mail', link: 'mailto:544289495@qq.com', icon: 'fa-envelope' },
    {
      title: 'QQ',
      link: 'tencent://AddContact/?fromId=45&amp;fromSubId=1&amp;subcmd=all&amp;uin=544289495&amp;website=www.oicqzone.com',
      icon: 'fa-qq'
    }
  ],
  friendLinks: [
    { title: '醉萝卜', link: 'http://www.chjtx.com/JRoll/' },
    { title: 'Zhendong', link: 'http://hzd.plus/' },
    { title: 'xiaojun', link: 'https://xiaojun.im/' },
    { title: 'Joeshu', link: 'https://shuzp.top/' },
    { title: 'Airing', link: 'https://me.ursb.me' },
    { title: '游魂', link: 'https://www.iyouhun.com' },
    { title: '荒野之萍', link: 'https://icoty.github.io/' },
    { title: 'imOne', link: 'https://im-one.github.io/' },
    { title: '陈健斌', link: 'https://www.jianshu.com/u/701a8bbf4f7e' },
    { title: '林毅锋', link: 'https://breeze2.github.io/blog/' },
    { title: '静かな森', link: 'https://innei.in/' },
    { title: '摩尔迦娜', link: 'http://morgiana.net/' },
    { title: '远川', link: 'https://crazystudent13.cn/' },
    { title: 'liangerwen', link: 'https://blog-nine-navy-52.vercel.app/' },
    { title: '百度', link: 'ttps://www.baidu.com/s?ie=UTF-8&amp;wd=site%3Alaibh.top' },
    {
      title: '谷歌',
      link: 'https://www.google.com.hk/search?safe=strict&amp;source=hp&amp;ei=zXdWXfemLJbO0PEP8qyXyA0&amp;q=site%3Alaibh.top&amp;oq=site%3Alaibh.top&amp;gs_l=psy-ab.3...580.8501..8767...0.0..0.397.934.2-1j2......0....2j1..gws-wiz.QESXfWGadT0&amp;ved=0ahUKEwi3wbusiofkAhUWJzQIHXLWBdkQ4dUDCAU&amp;uact=5'
    }
    // { title: 'Ambre', link: 'http://www.hourxu.com' },
    // { title: '赛马牛', link: 'https://blog.1088web.com/' },
    // { title: '汤姆Tom酱', link: 'http://lvhx.top/' },
    // { title: '赵铁柱', link: 'https://apih.andou.live' },
    // { title: '大鹏博客', link: 'http://www.qzroc.com/' },
  ],
  pagination: {
    size: 10
  },
  thirdParty: {
    supabase: {
      ANON_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncm5rc3hlc2xiY3pzcmh6am92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU2NTkxNTgsImV4cCI6MTk4MTIzNTE1OH0.tBNNvf9WkxT3Q_0tEW7TrnWWkvLtOmb1apeEmU9_qXQ',
      URL: 'https://rgrnksxeslbczsrhzjov.supabase.co'
    },
    algolia: {
      APPLICATION: '1YNH8Y3MP9',
      SEARCH_ONLY_API_KEY: '097bff07ff221e5fc4e28ae91cd53807',
      ALGOLIA_INDEX: 'nextjs-blog'
    },
    gitalk: {
      CLIENT_ID: '43ba13819a57e09f6839',
      CLIENT_SECRET: '41b35cbed07ff882aea3f2e0c0847f122511dea3',
      REPO: 'nextjs-blog',
      OWNER: 'LbhFront-end',
      ADMIN: ['LbhFront-end']
    }
  }
};

export default config;
