package middleware

import (
	"net/http"
	"time-ledger/internal/util"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "missing authorization header",
			})
			c.Abort()
			return
		}

		tokenStr := authHeader[len("Bearer "):]
		claims, err := util.ParseJWT(tokenStr, jwtSecret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid or token expired",
			})
			c.Abort()
			return
		}

		c.Set("user_uuid", claims["sub"])
		c.Next()
	}
}
