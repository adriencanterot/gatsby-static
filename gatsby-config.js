module.exports = {
  siteMetadata: {
      title: "Amateur's Work"
  },
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      // options: {
      //   plugins: ['gatsby-remark-pseudomatter']
      // }
    }
    ,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            name: `src`,
            path: `${__dirname}/src`
        }
        
    }
  ],
};