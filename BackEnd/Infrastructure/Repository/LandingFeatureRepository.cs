using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;
using OnlineShop.Infrastructure.Persistence;

namespace OnlineShop.Infrastructure.Repositories;

public class LandingFeatureRepository(AppDbContext context) : Repository<LandingFeature>(context), ILandingFeatureRepository { }
