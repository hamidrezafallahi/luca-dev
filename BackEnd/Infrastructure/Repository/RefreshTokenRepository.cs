using Microsoft.EntityFrameworkCore;
using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;
using OnlineShop.Infrastructure.Persistence;
using System.Linq.Expressions;

namespace OnlineShop.Infrastructure.Repositories
{
    public class RefreshTokenRepository : Repository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(AppDbContext context) : base(context)
        {
        }

        // پیدا کردن توکن با مقدار رشته‌ای آن
        // The refresh token is a 64-byte random secret, so it identifies the row on its own.
        // It must not also require the access token: by the time a refresh is needed the
        // candyAccess cookie has usually expired and the browser no longer sends it.
        public async Task<RefreshToken?> GetByTokenAsync(string refreshToken)
        {
            return await _context.RefreshTokens
        .Include(rt => rt.User)
            .ThenInclude(u => u.Role)
        .FirstOrDefaultAsync(rt => rt.Token == refreshToken);
        }

        // گرفتن تمام توکن‌های فعال یک کاربر
        public async Task<List<RefreshToken>> GetActiveTokensByUserIdAsync(int userId)
        {
            return await Table(rt => rt.UserId == userId && rt.IsActive())
                .Include(rt => rt.User)
                 .ThenInclude(u => u.Role)
                .ToListAsync();
        }

        // گرفتن آخرین توکن فعال برای یک کاربر با IP / Device مشخص
        public async Task<RefreshToken?> GetActiveTokenByUserIdAndDeviceAsync(int userId, string ip, string? userAgent)
        {
            return await Table(rt => rt.UserId == userId && rt.IsActive() &&
                                     rt.CreatedByIp == ip &&
                                     rt.CreatedByUserAgent == userAgent)
                .Include(rt => rt.User)
                .OrderByDescending(rt => rt.CreatedAt)
                .FirstOrDefaultAsync();
        }

        // ===== متد Table برای IQueryable =====
        public IQueryable<RefreshToken> Table(Expression<Func<RefreshToken, bool>>? predicate = null)
        {
            if (predicate == null)
                return _context.RefreshTokens.Include(rt => rt.User);

            return _context.RefreshTokens.Include(rt => rt.User).Where(predicate);
        }
    }
}
